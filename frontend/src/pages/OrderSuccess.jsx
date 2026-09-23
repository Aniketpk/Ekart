import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-5 bg-[#f5f5f7]">
      {/* Icon */}
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>

      {/* Title */}
      <h1 className="font-display text-2xl font-bold text-center text-[#121212]">
        Order Placed Successfully
      </h1>

      {/* Message */}
      <p className="text-center text-[#5c5c6d] font-body max-w-sm">
        Thank you for your order! Your order has been placed successfully and will be processed shortly.
      </p>

      {/* Buttons */}
      <button
        className="bg-[#1a237e] text-white px-6 py-2.5 rounded font-medium hover:bg-[#0d1759] transition-colors duration-200"
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>

      <button
        onClick={() => navigate("/my-orders")}
        className="w-full max-w-xs border border-[#1a237e] text-[#1a237e] px-4 py-2.5 rounded font-medium hover:bg-[#1a237e] hover:text-white transition-colors duration-200"
      >
        View My Orders
      </button>
    </div>
  );
};

export default OrderSuccess;