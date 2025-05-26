import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";
import MyAppointments from "./MyAppointments";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const MyProfile = () => {
  const { token, user, setUser, loadUserProfileData, baseURL } = useAuth();
  const { getAllStaffs } = useContext(AppContext);
  const [imageFile, setImageFile] = useState(null);

  const [isEdit, setIsEdit] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", user._id); // Thêm userId nếu backend yêu cầu
      formData.append("name", user.name);
      formData.append("phone", user.phone);
      formData.append("address", user.address);
      formData.append("dob", user.dob);
      formData.append("gender", user.gender);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.put(
        `${baseURL}/user/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Cập nhật thành công!");
        await loadUserProfileData();
        await getAllStaffs();
        setImageFile(null);
        setIsEdit(false);
      }
    } catch (error) {
      console.error("Full error:", error);
      toast.error(
        error.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại sau"
      );
    }
  };
  return token ? (
    <div className="flex items-center justify-center gap-2 text-sm  ">
      <div className="my-15 border border-gray-200 shadow-2xl md:w-[50%] h-140 rounded-2xl p-6">
        <div className="bg-amber-200 rounded">
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer h-36 ">
              <div className="inline-block relative">
                <img
                  className="w-36 rounded opacity-50 hover:opacity-100  "
                  src={imageFile ? URL.createObjectURL(imageFile) : user.image}
                  alt={user.name}
                />
                <img
                  className="w-15 absolute bottom-12 right-0 cursor-pointer"
                  src={imageFile ? "image" : assets.upload_icon}
                  alt=""
                />
              </div>
              <input
                onChange={(e) => setImageFile(e.target.files[0])}
                type="file"
                name="image"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img className="w-36 rounded" src={user.image} alt={user.name} />
          )}
        </div>
        {isEdit ? (
          <input
            type="text"
            className="bg-gray-100 text-3xl max-w-80 mt-4 rounded font-medium "
            value={user.name}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className=" font-medium text-3xl mt-4 text-neutral-800">
            {user?.name}
          </p>
        )}
        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div className=" mt-5">
          <p className="text-neutral-500 underline ">CONTACT INFORMATION</p>
          <div className="mt-2">
            <div className="flex">
              <p className="font-medium mr-4">Email:</p>
              <p className="text-blue-500"> {user?.email}</p>
            </div>
            <div className="flex">
              <p className="font-medium mr-4">Phone:</p>
              <div className="">
                {isEdit ? (
                  <input
                    type="text"
                    className="border border-zinc-200"
                    value={user.phone}
                    onChange={(e) =>
                      setUser((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className=" text-teal-400 ">{user?.phone}</p>
                )}
              </div>
            </div>
            <div className="flex">
              <p className="font-medium mr-4">Address:</p>
              {isEdit ? (
                <p className="">
                  <input
                    type="text"
                    className=" px-4 border border-zinc-200  "
                    value={user.address}
                    onChange={(e) =>
                      setUser((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </p>
              ) : (
                <p className="text-gray-500">{user?.address || "null"}</p>
              )}
            </div>

            <div className="flex">
              <p className="font-medium mr-4">Role:</p>
              <p className="text-blue-500">{user?.role}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-neutral-500 underline">BASIC INFORMATION</p>
          <div className="flex mt-2">
            <p className="font-medium">Giới tính :</p>
            {isEdit ? (
              <select
                value={user.gender}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="">Chọn giới tính</option>
                <option className="max-w-20" value="Nam">
                  Nam
                </option>
                <option value="Nữ">Nữ</option>
              </select>
            ) : (
              <p className="mx-2 text-gray-500">{user?.gender || "null"}</p>
            )}
          </div>
          <div className="flex">
            <p className="font-medium">Birthday :</p>
            {isEdit ? (
              <p className="">
                <input
                  type="date"
                  className=" px-4 border border-zinc-200 w-full "
                  value={user.dob}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, dob: e.target.value }))
                  }
                />
              </p>
            ) : (
              <p className="mx-2 text-gray-500">{user?.dob || "null"}</p>
            )}
          </div>
        </div>
        <div className=" my-8">
          {isEdit ? (
            <div className="">
              <button
                onClick={updateUserProfileData}
                className="bg-blue-400 px-4 py-2 rounded-2xl hover:bg-blue-600 text-white duration-300 cursor-pointer"
              >
                Save information
              </button>
              <button
                onClick={() => setIsEdit(false)}
                className="bg-red-400 px-4 py-2 rounded-2xl hover:bg-red-600 text-white duration-300 cursor-pointer ml-4"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-blue-400 px-4 py-2 rounded-2xl hover:bg-blue-600 text-white duration-300 cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Please log in to view your profile
      </h1>
      <p className="text-gray-600 mb-4">
        You need to be logged in to access this page.
      </p>
      <button
        onClick={() => (window.location.href = "/login")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Go to Login
      </button>
    </div>
  );
};

export default MyProfile;
