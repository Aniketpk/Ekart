import { Cart } from "../models/cartModel.js";
import { product as ProductModel } from "../models/productModel.js";


export const getCart = async (req, res) => {
    try {
        const userId = req.id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) {
            return res.json({
                success: true,
                cart: { items: [], totalPrice: 0 }
            })
        }
        res.status(200).json({
            success: true,
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;
        //check if product exists
        const productData = await ProductModel.findById(productId);
        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        //find the user's cart
        let cart = await Cart.findOne({ userId });
        //if cart doesn't exist, create one
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId: productId, quantity: 1, price: productData.productPrice }],
                totalPrice: productData.productPrice
            })
        } else {
            //find if product already exists in cart
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
            if (itemIndex > -1) {
                //product exists, increase quantity
                cart.items[itemIndex].quantity += 1;
            } else {
                //product doesn't exist, add it
                cart.items.push({
                    productId,
                    quantity: 1,
                    price: productData.productPrice
                });
            }
            //recalculate total price
            cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
        //save cart
        await cart.save();
        //populate product details before sending response
        const populatedCart = await Cart.findById(cart._id).populate("items.productId");
        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: populatedCart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1)
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            })

        if (type === "increase") cart.items[itemIndex].quantity += 1;
        if (type === "decrease" && cart.items[itemIndex].quantity > 1) cart.items[itemIndex].quantity -= 1;

        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await cart.save();
        cart = await cart.populate("items.productId");
        res.status(200).json({
            success: true,
            message: "Product quantity updated successfully",
            cart
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        cart = await cart .populate("items.productId")
        await cart.save();
        res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

