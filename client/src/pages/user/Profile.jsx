import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/user"; // เพิ่มฟังก์ชันนี้เพื่อดึงข้อมูลของ user
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";

const Profile = () => {
  const token = useEcomStore((state) => state.token); // ใช้ token จาก store
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      hdlGetUserInfo(token); // ดึงข้อมูล user
    }
  }, [token]);

  const hdlGetUserInfo = (token) => {
    getCurrentUser(token)
      .then((res) => {
        setProfile(res.data.user); // ตั้งค่า profile เมื่อได้รับข้อมูล
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        toast.error("ไม่สามารถดึงข้อมูลได้ครับ");
      });
  };


  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-xl font-bold text-center mb-4">Profile</h2>
      <div className="flex flex-col items-center">
        <img
          src={profile.picture || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        />
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
        <p><strong>Address:</strong> {profile.address || "กรอกหน้าตอนสั่งสินค้า"}</p> 
      </div>
    </div>
  );
};

export default Profile;