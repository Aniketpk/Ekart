import razorpayInstance from "../config/razorpay.js";
import { Order } from "../models/orderModel.js";
import crypto from "crypto";
import { Cart } from "../models/cartModel.js";
import User from "../models/userModels.js";
import { product } from "../models/productModel.js";



export const createOrder = async (req, res) => {
    try {
        const { address } = req.body;
        const requiredAddressFields = ["fullName", "email", "phone", "street", "city", "state", "zipCode", "country"];
        if (!address || requiredAddressFields.some((field) => typeof address[field] !== "string" || !address[field].trim())) {
            return res.status(422).json({ success: false, message: "A complete delivery address is required" });
        }

        const cart = await Cart.findOne({ userId: req.id });
        if (!cart?.items?.length) {
            return res.status(409).json({ success: false, message: "Your cart is empty" });
        }

        const productIds = cart.items.map((item) => item.productId);
        const currentProducts = await product.find({ _id: { $in: productIds } });
        const productById = new Map(currentProducts.map((item) => [item._id.toString(), item]));
        const orderProducts = [];
        for (const item of cart.items) {
            const currentProduct = productById.get(item.productId.toString());
            if (!currentProduct || !Number.isFinite(currentProduct.productPrice) || currentProduct.productPrice < 0) {
                return res.status(409).json({ success: false, message: "A product in your cart is no longer available" });
            }
            if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
                return res.status(422).json({ success: false, message: "Cart contains an invalid quantity" });
            }
            orderProducts.push({ productId: currentProduct._id, quantity: item.quantity, price: currentProduct.productPrice });
        }

        const subtotal = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal > 299 ? 0 : 10;
        const tax = Number((subtotal * 0.05).toFixed(2));
        const amount = Number((subtotal + shipping + tax).toFixed(2));
        const currency = "INR";

        // Razorpay expects paise. The amount is derived only from current database prices.
        const amountInPaise = Math.round(amount * 100);

        const options = {
            amount: amountInPaise,
            currency,
            receipt: `receipt_${Date.now()}`,
        }
        const razorpayOrder = await razorpayInstance.orders.create(options)

        //save in DB

        const newOrder = new Order({
            user: req.user.id,
            products: orderProducts,
            amount,
            tax,
            shipping,
            address: Object.fromEntries(requiredAddressFields.map((field) => [field, address[field].trim()])),
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        })

        await newOrder.save()
        res.json({
            success: true,
            order: razorpayOrder,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID
        })
    } catch (error) {
        console.error("Order creation failed:", error.name);
        res.status(500).json({ sucess: false, message: "The request could not be completed" })


    }
}

export const verfyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body
        if (paymentFailed) return res.status(422).json({ success: false, message: "Payment failures must be confirmed by the payment provider" });
        if (typeof razorpay_order_id !== "string" || typeof razorpay_payment_id !== "string" || typeof razorpay_signature !== "string") {
            return res.status(422).json({ success: false, message: "Payment verification details are incomplete" });
        }
        
        if (!process.env.RAZORPAY_SECRET) {
            console.error("RAZORPAY_SECRET is missing in environment variables");
            return res.status(500).json({ success: false, message: "Server configuration error" })
        }

        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, user: req.id });
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const expected = Buffer.from(generated_signature, "hex");
        const supplied = Buffer.from(razorpay_signature, "hex");
        if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) {
            return res.status(400).json({ success: false, message: "Payment Failed" });
        }
        if (order.status === "Paid") {
            return order.razorpayPaymentId === razorpay_payment_id
                ? res.status(200).json({ success: true, message: "Payment already verified" })
                : res.status(409).json({ success: false, message: "A different payment already completed this order" });
        }
        if (order.status === "Pending") {
                order.status = "Paid";
                order.razorpayPaymentId = razorpay_payment_id;
                order.razorpaySignature = razorpay_signature;
                await order.save();

                //clear cart after payment
                await Cart.findOneAndUpdate(
                    { userId: order.user },
                    { items: [], totalPrice: 0 }
                )
            return res.status(200).json({ success: true, message: "Payment Verified" })
        }
        return res.status(409).json({ success: false, message: "Order is not awaiting payment" });
    } catch (error) {
        console.error("Payment verification failed:", error.name);
        return res.status(500).json({ sucess: false, message: "The request could not be completed" })
    }
}

export const getMyOrder = async (req, res) => {
    try {
        const userId = req.id
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found" })
        }
        const orders = await Order.find({ user: userId })
            .populate({ path: "products.productId", select: "productName productPrice productImg" })
            .populate("user", "firstName lastName email")

        res.json({ success: true, count: orders.length, orders })
    } catch (error) {
        console.error("User order lookup failed:", error.name)
        res.status(500).json({ success: false, message: "The request could not be completed" })
    }
}


//Admin only 
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params; //userid will come from route url

        const orders = await Order.find({ user: userId })
            .populate({ path: "products.productId", select: "productName productPrice productImg" })
            .populate("user", "firstName lastName email")
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })

    } catch (error) {
        console.error("Admin order lookup failed:", error.name)
        res.status(500).json({ success: false, message: "The request could not be completed" })
    }
}

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "firstName lastName email")
            .populate("products.productId", "productName productPrice productImg")
        res.json({
            success: true,
            count: orders.length,
            orders

        })
    } catch (error) {
        console.error("Admin order listing failed:", error.name);
        res.status(500).json({
            success: false,
            message: "failed to fetch all orders",
        })
    }
}
 
export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({})
        const totalProducts = await product.countDocuments({})
        const totalOrders = await Order.countDocuments({ status: "Paid" })


        // total sales amount 
        const totalSalesAgg = await Order.aggregate([
            {
                $match: { status: "Paid" }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ])



        const totalSales = totalSalesAgg[0]?.total || 0;
        //sales group  by data( last 30 dsy )

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        let salesByDate = await Order.aggregate([
            {
                $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    amount: { $sum: "$amount" },
                }
            },
            { $sort: { _id: 1 } }
        ])

        // If no sales in the last 30 days, fallback to all paid orders so the dashboard graph has data
        if (!salesByDate.length) {
            salesByDate = await Order.aggregate([
                {
                    $match: { status: "Paid" }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        amount: { $sum: "$amount" },
                    }
                },
                { $sort: { _id: 1 } }
            ])
        }

        const formattedSalesByDate = salesByDate.map((item) => ({
            date: item._id,
            amount: item.amount
        }))
       
        res.json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            salesByDate: formattedSalesByDate
        })
    } catch (error) {
        console.error("Sales summary lookup failed:", error.name);
        res.status(500).json({
            success: false,
            message: "failed to fetch sales data",
        })
    }
}
