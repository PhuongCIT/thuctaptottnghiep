import React, { useEffect, useState } from "react";
import contactApi from "../../services/contactService";
import { FiTrash2 } from "react-icons/fi";
const ContactManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contacts, setContact] = useState([]);

  const getAllContact = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API
      const response = await contactApi.getAll();
      const data = response.data.data;
      console.log("Data Contact :", data);
      if (data && Array.isArray(data)) {
        setContact(data);
      } else {
        setContact([]);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      setError("Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllContact();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl animate-pulse">Đang tải ...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={getAllContact}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }
  return (
    <div className="p-6">
      {" "}
      <div className="md:col-span-2">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Liên hệ</h2>
          {contacts.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-center  justify-betweens"
            >
              <p className="font-bold">{item.name}</p>

              <p>{item.subject}</p>
              <p className="overflow-hidden">{item.message}</p>

              <p>{item.createdAt}</p>
              {item.isRead === false && (
                <div className="bg-green-400 w-3 h-3 rounded-full items-end"></div>
              )}
              <p className="px-4 py-3 whitespace-nowrap space-x-2">
                <button className="text-red-500 hover:text-red-700 transition cursor-pointer">
                  <FiTrash2 className="inline w-5 h-5" />
                </button>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactManagement;
