import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import CardService from "./CardService";

const TopServices = () => {
  const navigate = useNavigate();
  const { services, errorService, loadingService, getAllServices } =
    useContext(AppContext);

  // console.log("service DAta: ", services);

  if (loadingService) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl animate-pulse">Đang tải dịch vụ...</div>
        </div>
      </section>
    );
  }

  if (errorService) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-600 mb-4">{errorService}</div>
          <button
            onClick={getAllServices}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Dịch Vụ Nổi Bật</h1>

      <div className="w-full grid grid-cols-1  sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {services.slice(0, 5).map((item) => (
          <CardService item={item} key={item._id} />
        ))}
      </div>
      <button
        onClick={() => {
          navigate(`/services`);
          scrollTo(0, 0);
        }}
        className="bg-blue-200 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        Xem tất cả dịch vụ
      </button>
    </div>
  );
};

export default TopServices;
