import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const logout = useEcomStore((state) => state.logout);

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    logout(); // ล้างข้อมูลผู้ใช้ที่อาจค้างอยู่
  }, []);

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      localStorage.setItem("token", res.data.token);
      roleRedirect(res.data.payload.role);
      toast.success("Welcome Back");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/"); // ✅ ให้ไปหน้าหลักแทนการย้อนกลับ
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-300">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Login</h1>
        <p className="text-gray-500 text-center mt-1">เข้าสู่ระบบเพื่อใช้งาน</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <input
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleOnChange}
              name="email"
              type="email"
              required
            />
          </div>

          <div>
            <input
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleOnChange}
              name="password"
              type="password"
              required
            />
          </div>

          <button
            className="w-full py-3 text-white font-bold rounded-lg shadow-md
                       bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                       transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
