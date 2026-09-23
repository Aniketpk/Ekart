import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
   
},{timestamps:true})

    export const session =mongoose.model("Session",sessionSchema)
