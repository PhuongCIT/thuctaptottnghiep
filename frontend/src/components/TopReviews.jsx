import React from "react";
import StarRating from "./StarRating";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const TopReviews = () => {
  const { reviews, loadingReviews, errorReviews, getReviews } =
    useContext(AppContext);
  // Cấu hình slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, //thời gian chuyẻn slide
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  if (loadingReviews) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl animate-pulse">Đang tải...</div>
        </div>
      </section>
    );
  }

  if (errorReviews) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-600 mb-4">{errorReviews}</div>
          <button
            onClick={getReviews}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col items-center  gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Đánh Giá Của Khách Hàng</h1>

      <div className="w-full max-w-6xl px-4 py-8">
        <Slider {...sliderSettings}>
          {reviews.map((item, index) => (
            <div key={index} className="px-2">
              <div className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 bg-white p-6 h-60">
                <div className="text-gray-600 text-sm flex justify-center items-center">
                  <img
                    src={item.customerId.image}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <h1 className="">{item.customerId.name}</h1>
                </div>
                <h1 className="">{item.serviceId.name}</h1>

                <p className="text-gray-900 text-lg  h-20 font-light overflow-hidden">
                  {item.comment}
                </p>
                <StarRating rating={item.rating} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TopReviews;
