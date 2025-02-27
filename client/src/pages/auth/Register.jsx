// rafce
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { useForm } from "react-hook-form";

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "ต้องกรอกชื่อ-นามสกุล" }),
    phone: z.string().regex(/^\d{10}$/, { message: "เบอร์โทรต้องเป็นตัวเลข 10 หลัก" }),
    email: z.string().email({ message: "Invalid email!!!" }),
    password: z.string().min(8, { message: "Password ต้องมากกว่า 8 ตัวอักษร" }),
    confirmPassword: z.string(),
    role: z.enum(["user", "admin"]), // กำหนด role ว่าต้องเป็น user หรือ admin
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password ไม่ตรงกัน",
    path: ["confirmPassword"],
  });


const Register = () => {
  // Javascript
  const [passwordScore, setPasswordScore] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "user" }, // ค่าเริ่มต้นเป็น user
  });

  const validatePassword = () => {
    let password = watch().password;
    return zxcvbn(password ? password : "").score;
  };
  useEffect(() => {
    setPasswordScore(validatePassword());
  }, [watch().password]);

  const onSubmit = async (data) => {
    // const passwordScore = zxcvbn(data.password).score;
    // console.log(passwordScore);
    // if (passwordScore < 3) {
    //   toast.warning("Password No Strong!!!!!");
    //   return;
    // }
    // console.log("ok ทำการส่งข้อมูลไปที่เซิฟเวอร์");
    // Send to Back
    try {
      const res = await axios.post("http://localhost:5001/api/register", data);

      console.log(res.data);
      toast.success(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
      console.log(err);
    }
  };

  // const tam = Array.from(Array(5))
  // console.log(tam)
  console.log(passwordScore);
  return (
    <div
      className="min-h-screen flex 
    items-center justify-center bg-gray-100"
    >
      <div className="w-full shadow-md bg-white p-8 max-w-md">
        <h1 className="text-2xl text-center my-4 font-bold">Register</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className={`border w-full px-3 py-2 rounded
            focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-transparent
            ${errors.email && "border-red-500"}
            `}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("password")}
                placeholder="Password"
                type="password"
                className={`border w-full px-3 py-2 rounded
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent
              ${errors.password && "border-red-500"}
              `}
              />

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              {watch().password?.length > 0 && (
                <div className="flex mt-2">
                  {Array.from(Array(5).keys()).map((item, index) => (
                    <span className="w-1/5 px-1" key={index}>
                      <div
                        className={`rounded h-2 ${
                          passwordScore <= 2
                            ? "bg-red-500"
                            : passwordScore < 4
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }
              `}
                      ></div>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <input {...register("confirmPassword")} 
              type="password"
               placeholder="Confirm Password"
              className={`border w-full px-3 py-2 rounded
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent
                ${errors.confirmPassword && "border-red-500"}
                `}
                />


              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* ✅ เพิ่มตัวเลือก Role */}
            <div>
              <label>Role:</label>
              <select {...register("role")} className="border w-full px-3 py-2 rounded">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div>
  <input
    {...register("name")}
    placeholder="ชื่อ-นามสกุล"
    className={`border w-full px-3 py-2 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500
    focus:border-transparent
    ${errors.name && "border-red-500"}
    `}
  />
  {errors.name && (
    <p className="text-red-500 text-sm">{errors.name.message}</p>
  )}
</div>

<div>
  <input
    {...register("phone")}
    placeholder="เบอร์โทร"
    className={`border w-full px-3 py-2 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500
    focus:border-transparent
    ${errors.phone && "border-red-500"}
    `}
  />
  {errors.phone && (
    <p className="text-red-500 text-sm">{errors.phone.message}</p>
  )}
</div>

            <button 
            className="bg-blue-500 rounded-md
             w-full text-white font-bold py-2 shadow
             hover:bg-blue-700
             ">
              Register
              </button>


          </div>
        </form>
      </div>
    </div>
  );
};


export default Register;
