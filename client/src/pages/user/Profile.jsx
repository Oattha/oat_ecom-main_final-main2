import React, { useState, useEffect } from "react";
import { getCurrentUser, uploadProfilePicture, removeFiles } from "../../api/user"; 
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import Resize from "react-image-file-resizer"; // สำหรับรีไซซ์รูปภาพ

const Profile = () => {
  const token = useEcomStore((state) => state.token); // ใช้ token จาก store
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // สำหรับสถานะการโหลด

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

  // ฟังก์ชันจัดการการเลือกไฟล์รูปโปรไฟล์
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} "ไม่ใช่รูป`);
        setIsLoading(false);
        return;
      }
      // ทำการรีไซซ์รูปภาพ
      Resize.imageFileResizer(
        file,
        720,
        720,
        "JPEG",
        100,
        0,
        (data) => {
          uploadProfilePicture(token, data) // ฟังก์ชัน uploadFiles ต้องเชื่อมต่อกับ API ที่เราเขียนไว้
            .then((res) => {
              setProfile((prevProfile) => ({
                ...prevProfile,
                picture: res.data.picture, // อัปเดตรูปโปรไฟล์
              }));
              setIsLoading(false);
              toast.success("อัปโหลดรูปโปรไฟล์สำเร็จ");
            })
            .catch((err) => {
              console.error("Error uploading picture:", err);
              setIsLoading(false);
              toast.error("ไม่สามารถอัปโหลดรูปโปรไฟล์ได้");
            });
        },
        "base64"
      );
    }
  };

  // ฟังก์ชันสำหรับลบรูปโปรไฟล์
  const handleDeleteProfilePicture = () => {
    if (profile?.picture) {
      setIsLoading(true);
      removeFiles(token, profile.picture) // ฟังก์ชัน removeFiles ต้องเชื่อมต่อกับ API ที่เราเขียนไว้
        .then(() => {
          setProfile((prevProfile) => ({
            ...prevProfile,
            picture: null, // ลบรูปโปรไฟล์
          }));
          setIsLoading(false);
          toast.success("ลบรูปโปรไฟล์สำเร็จ");
        })
        .catch((err) => {
          console.error("Error deleting profile picture:", err);
          setIsLoading(false);
          toast.error("ไม่สามารถลบรูปโปรไฟล์ได้");
        });
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-xl font-bold text-center mb-4">Profile</h2>
      <div className="flex flex-col items-center">
        {/* รูปโปรไฟล์ */}
        <img
          src={profile.picture || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        />
        
        {/* ปุ่มอัปโหลดรูปโปรไฟล์ */}
        <label
          htmlFor="file-upload"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mb-4"
        >
          อัปโหลดรูปโปรไฟล์
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handlePictureChange}
          className="hidden"
        />
        
        {/* ปุ่มลบรูปโปรไฟล์ */}
        {profile.picture && (
          <button
            onClick={handleDeleteProfilePicture}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            ลบรูปโปรไฟล์
          </button>
        )}

        {/* ปุ่มแสดงการอัปโหลด */}
        {isLoading && <div className="w-16 h-16 animate-spin">Loading...</div>}

        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
        <p><strong>Address:</strong> {profile.address || "กรอกหน้าตอนสั่งสินค้า"}</p>
      </div>
    </div>
  );
};

export default Profile;
