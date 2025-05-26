import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
// import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/"); // Điều hướng đến trang user
    } catch (err) {
      // Xử lý lỗi nếu đăng nhập thất bại
      toast.error("Đăng nhập thất bại");
      console.error("Login error:", err);
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center " onSubmit={submitLogin}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-zinc-300  rounded-2xl text-sm shadow-lg  ">
        <p className="text-2xl font-semibold">Login</p>
        <p className="">Plase log in to bool appointment</p>

        <div className="w-full">
          <p className="">Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <p className="">Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button className="bg-blue-500 w-full px-4 py-3 rounded-2xl hover:bg-blue-300 text-white cursor-pointer">
          Login
        </button>

        <p>
          Don't have an account ?
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 underline cursor-pointer ml-2"
          >
            Sign up here
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
