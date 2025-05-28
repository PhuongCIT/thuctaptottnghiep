import React from "react";
import StarRating from "./StarRating";

const TopReviews = ({ reviews }) => {
  return (
    <div className="flex flex-col items-center  gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Đánh Giá Của Khách Hàng</h1>

      <div className="w-full   grid grid-cols-1  sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4  gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {reviews.slice(0, 4).map((item, index) => (
          <div
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden  hover:translate-y-[-10px] transition-all duration-300"
          >
            <div className="p-4">
              <div className="text-gray-600 text-sm flex justify-center items-center">
                <img
                  src={item.customerId.image}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <h1 className="">{item.customerId.name}</h1>
              </div>
              <h1 className="">{item.serviceId.name}</h1>

              <p className="text-gray-900 text-lg  h-20 font-light">
                {item.comment}
              </p>
              <StarRating rating={item.rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopReviews;
