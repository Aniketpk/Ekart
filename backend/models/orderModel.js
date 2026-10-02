import mongoose, { Types } from "mongoose"

const orderschema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User" ,
        required:true
    },
   products: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId,ref:"Product", required:true},
            quantity:{type: Number, required:true},
            price:{type:Number, min:0}
        }
    
   ],
   amount : {type:Number, required:true},
   tax:{type:Number,required:true},
   shipping:{type:Number,required:true},
   address: {
       fullName: { type: String },
       email: { type: String },
       phone: { type: String },
       street: { type: String },
       city: { type: String },
       state: { type: String },
       zipCode: { type: String },
       country: { type: String }
   },
   currency:{type:String,default:"INR"},
   status:{type:String,enum:["Pending","Paid","Failed"],default:"Pending"},


   //razorpay Fields 
    
   razorpayOrderId: {type:String},
   razorpayPaymentId: {type:String},
   razorpaySignature: {type:String}
   
},{timestamps:true});

export const Order = mongoose.model("Order", orderschema);
