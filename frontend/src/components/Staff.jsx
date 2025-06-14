import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Staff = () => {
  const { staffs, loadingStaffs, errorStaffs, getStaffs } =
    useContext(AppContext);
  // Cấu hình slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 4,
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

  if (loadingStaffs) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl animate-pulse">Đang tải...</div>
        </div>
      </section>
    );
  }

  if (errorStaffs) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-600 mb-4">{errorStaffs}</div>
          <button
            onClick={getStaffs}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }
  return (
    <section className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h2 className="text-3xl font-medium">Nhân viên Của chúng tôi</h2>

      <div className="w-full max-w-6xl px-4 py-8">
        <Slider {...sliderSettings}>
          {staffs.map((staff, index) => (
            <div key={index} className="px-2">
              <div className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 bg-white p-6 h-full">
                <img
                  src={
                    staff.image ||
                    "https://www.w3schools.com/w3images/avatar2.png"
                  }
                  alt={staff.name}
                  className="h-20 w-20 mx-auto rounded-full object-cover"
                />
                <h4 className="text-xl font-bold mt-4 text-center">
                  {staff.name}
                </h4>
                <p className="mt-1 text-center">{staff.position}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Staff;
