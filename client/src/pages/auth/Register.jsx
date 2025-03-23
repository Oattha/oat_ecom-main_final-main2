import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // ✅ ต้องอยู่ใน Component เท่านั้น

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "ต้องกรอกชื่อ-นามสกุล" }),
    phone: z.string().regex(/^\d{10}$/, { message: "เบอร์โทรต้องเป็นตัวเลข 10 หลัก" }),
    email: z.string().email({ message: "Invalid email!!!" }),
    password: z.string().min(8, { message: "Password ต้องมากกว่า 8 ตัวอักษร" }),
    confirmPassword: z.string(),
    address: z.string().min(5, { message: "กรุณากรอกที่อยู่ (อย่างน้อย 5 ตัวอักษร)" }), // ✅ เพิ่มที่อยู่
    role: z.enum(["user", "admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password ไม่ตรงกัน",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [passwordScore, setPasswordScore] = useState(0);
  const navigate = useNavigate(); // ✅ ต้องอยู่ในฟังก์ชัน Component เท่านั้น

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "user" },
  });

  useEffect(() => {
    setPasswordScore(zxcvbn(watch("password") || "").score); // ✅ ใช้ watch("password") ให้ถูกต้อง
  }, [watch("password")]);

  const onSubmit = async (data) => {
    if (data.role === "admin") {
      toast.error("โปรดติดต่อเราเพื่อสมัครเป็น Admin ❌");
      return; // ❌ หยุดการสมัคร
    }

    try {
      await axios.post("http://localhost:5001/api/register", data);

      toast.success("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-300">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Register</h1>
        <p className="text-gray-500 text-center mt-1">ลงทะเบียนเพื่อเข้าใช้งาน</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.email && "border-red-500"}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.password && "border-red-500"}`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.confirmPassword && "border-red-500"}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          <div>
            <input
              {...register("name")}
              placeholder="ชื่อ-นามสกุล"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.name && "border-red-500"}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register("phone")}
              placeholder="เบอร์โทร"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.phone && "border-red-500"}`}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          <div>

            <input
              {...register("address")}
              placeholder="ที่อยู่"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.address && "border-red-500"}`}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          <div>
            <label className="text-gray-700 font-medium">Role:</label>
            <select {...register("role")} className="w-full px-4 py-3 border rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>


          <button className="w-full py-3 text-white font-bold rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
