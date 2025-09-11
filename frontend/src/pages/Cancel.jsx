import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto md:px-40 flex justify-center items-center h-[calc(100vh-6rem)]">
      <div className="bg-white border border-slate-300 rounded-2xl shadow-xl p-6 w-full max-w-lg text-center animate-fade-in">
        
        {/* Modern Payment Cancel Animation */}
        <div className="flex justify-center">
          <img 
            src="https://tenor.com/view/hedgepay-hpay-gif-26056967"
            alt="Payment Cancelled"
            className="w-32 h-32 object-contain"
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide mt-4">
          Payment Cancelled
        </h2>
        <p className="text-slate-600 mt-2 text-sm md:text-base px-2">
          Your payment could not be completed.<br />
          Please try again to place your order.
        </p>

        <div className="w-full h-[1px] bg-slate-300 opacity-50 my-6"></div>

        <button
          onClick={() => navigate("/cart")}
          className="bg-[#FF527B] hover:bg-[#fa4b74] text-white font-semibold tracking-wider py-3 px-6 w-full rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
        >
          GO TO CART
        </button>

        <p 
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-[#FF527B] cursor-pointer hover:underline transition-all duration-300"
        >
          Continue Shopping
        </p>
      </div>

      {/* Tailwind animation keyframe */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.8s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default Cancel;
