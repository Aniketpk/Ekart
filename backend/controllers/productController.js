import { product as ProductModel } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.id;

        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //Handle multiple image upload
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mern_products"

                });
                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }
        const newProduct = await ProductModel.create({
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg,
            userId
        })
        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllProduct = async (_, res) => {
    try {
        const products = await ProductModel.find();
        if (!products) {
            return res.status(404).json({
                success: false,
                message: "No products found",
                products: []
            })
        }
        return res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        //delete images from cloudinary
        if (product.productImg && product.productImg.length > 0) {
            for (const img of product.productImg) {
                const result = await cloudinary.uploader.destroy(img.public_id);

            }
        }
        //delete product from database
        await ProductModel.findByIdAndDelete(productId);
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, productPrice, category, brand, existImages } = req.body;
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        let updatedImages = [];
        if (existImages) {
            const keepIds = JSON.parse(existImages);
            updatedImages = product.productImg.filter((img) => keepIds.includes(img.public_id));

            const removedImages = product.productImg.filter((img) => !keepIds.includes(img.public_id));
            for (let img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        } else {
            updatedImages = product.productImg;
        }

        //update product images if new images are uploaded
        if (req.files && req.files.length > 0) {
            //delete old images from cloudinary

            for (let file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mern_products"
                });
                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }


        //update product details
        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updatedImages;
        await product.save();
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
