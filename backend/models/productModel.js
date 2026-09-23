import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productName: { type: String, required: true },
    productDesc: { type: String, required: true },

    productImg: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ],
    productPrice: { type: Number },
    category: { type: String },
    brand: { type: String }


},
    { timestamps: true }
)
export const product = mongoose.model("Product", productSchema)