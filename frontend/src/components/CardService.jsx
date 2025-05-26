import React from "react";
import { useNavigate } from "react-router-dom";
import cattoc from "../assets/images/cattoc.jpg";

const CardService = ({ item, index }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };
  return (
    <div
      key={index}
      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300"
    >
      <img
        src={item.image}
        // src={cattoc}
        alt={item.name}
        className="bg-blue-50 w-full h-2/3"
      />
      <div className="p-4">
        <p className="text-gray-900 text-lg font-medium">{item.name}</p>
        <div className="text-gray-600 text-sm">
          <p>
            Giá từ:{" "}
            <span className="text-red-500 mx-1">
              {formatPrice(item.price)} VNĐ
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            navigate("/booking");
          }}
          className="text-amber-700 my-2 font-bold text-lg bg-amber-300 py-2 px-4 rounded-2xl hover:bg-amber-200"
        >
          Đặt lịch ngay
        </button>
      </div>
    </div>
  );
};

export default CardService;
