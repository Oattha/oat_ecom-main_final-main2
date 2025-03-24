import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom";
import { currentUser, googlelogin } from "../../api/auth"; // ✅ ใช้ API ที่ถูกต้อง
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const [form, setForm] = useState({ email: "", password: "" });

  // ✅ ตรวจจับ token จาก Google OAuth และล็อกอินอัตโนมัติ
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        console.log("✅ Token Received:", token);
        localStorage.setItem("token", token);
        navigate("/"); // เปลี่ยนเส้นทางไปหน้าหลัก
    }
}, []);



  // ✅ ฟังก์ชันอัพเดตฟอร์มเมื่อกรอกข้อมูล
  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ฟังก์ชันล็อกอินปกติ
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      
      // ✅ บันทึก token และข้อมูลผู้ใช้
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
  
      // ✅ โหลดข้อมูลผู้ใช้ และนำไปยังหน้าแดชบอร์ด
      fetchUser(res.data.token);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };
  

  // ✅ ฟังก์ชันดึงข้อมูลผู้ใช้จาก token
  const fetchUser = async (token, isGoogle = false) => {
    try {
      console.log("🔍 Fetching user with token:", token);
  
      const res = isGoogle ? await googlelogin(token) : await currentUser(token);
  
      console.log("✅ User fetched:", res.data);
  
      // ✅ บันทึก user ลงใน localStorage และเปลี่ยนเส้นทาง
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success(`Welcome ${res.data.email}`);
  
      // ✅ เปลี่ยนเส้นทางไปยังแดชบอร์ด
      navigate("/");
    } catch (err) {
      console.error("❌ Authentication Failed:", err.response?.data || err);
      toast.error("User Authentication failed");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  

  // ✅ ฟังก์ชันล็อกอินผ่าน Google OAuth
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/auth/google";
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
              className="w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleOnChange}
              name="email"
              type="email"
              required
            />
          </div>

          <div>
            <input
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleOnChange}
              name="password"
              type="password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-bold rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition duration-300"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" className="w-5 h-5" />
            <span className="text-gray-700 font-semibold">Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
