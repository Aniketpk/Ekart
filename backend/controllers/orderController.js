import razorpayInstance from "../config/razorpay.js";
import { Order } from "../models/orderModel.js";
import crypto from "crypto";
import { Cart } from "../models/cartModel.js";
import { count, log } from "console";
import User from "../models/userModels.js";
import { product } from "../models/productModel.js";



export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body;

        // Razorpay expects amount in paise (1 INR = 100 paise)
        let amountInPaise = Math.round(Number(amount) * 100);

        const options = {
            amount: amountInPaise,
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        }
        const razorpayOrder = await razorpayInstance.orders.create(options)

        //save in DB

        const newOrder = new Order({
            user: req.user.id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        })

        await newOrder.save()
        res.json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        })
    } catch (error) {
        console.error("❌ error in create Order:", error);
        res.status(500).json({ sucess: false, message: error.message })


    }
}

export const verfyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body
        if (req.body.paymentFailed) {
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id })
            if (order) {
                order.status = "Failed"
                await order.save()
            }
            return res.status(400).json({ success: false, message: "Payment Failed" })
        }
        
        if (!process.env.RAZORPAY_SECRET) {
            console.error("RAZORPAY_SECRET is missing in environment variables");
            return res.status(500).json({ success: false, message: "Server configuration error" })
        }

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id })
            if (order) {
                order.status = "Paid"
                order.razorpayPaymentId = razorpay_payment_id
                await order.save()

                //clear cart after payment
                await Cart.findOneAndUpdate(
                    { userId: order.user },
                    { items: [], totalPrice: 0 }
                )
            }
            return res.status(200).json({ success: true, message: "Payment Verified" })
        } else {
            return res.status(400).json({ success: false, message: "Payment Failed" })
        }
    } catch (error) {
        console.error("error in payment verification", error);
        return res.status(500).json({ sucess: false, message: error.message })
    }
}

export const getMyOrder = async (req, res) => {
    try {
        const userId = req.id
        console.log("getMyOrder called for userId:", userId)
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found" })
        }
        const orders = await Order.find({ user: userId })
            .populate({ path: "products.productId", select: "productName productPrice productImg" })
            .populate("user", "firstName lastName email")

        res.json({ success: true, count: orders.length, orders })
    } catch (error) {
        console.error("Error fetching user order:", error)
        res.status(500).json({ success: false, message: error.message })
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
        console.log("Error fetching user order :", error)
        res.status(500).json({ message: error })
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
        console.log(error);
        res.status(500).json({
            success: false,
            message: "failed to fetch all orders",
            error: error.message
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

        const salesByDate = await Order.aggregate([
            {
                $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                    amount: { $sum: "$amount" },
                }

            },
            { $sort: { _id: 1 } }
        ])

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
        console.log(error);
        res.status(500).json({
            success: false,
            message: "failed to fetch sales data",
            error: error.message
        })
    }
}