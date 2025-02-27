import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // ใช้ useParams สำหรับการดึง orderId
import useEcomStore from "../../store/ecom-store"; // ใช้ store สำหรับดึง token
import { toast } from "react-toastify"; // ใช้สำหรับการแสดงข้อความเตือน
import { getOrderTracking } from "../../api/user"; // ใช้ฟังก์ชันนี้ในการดึงข้อมูลจาก API

const OrderTracking = () => {
  const { orderId } = useParams(); // ดึง orderId จาก URL
  const token = useEcomStore((state) => state.token); // ใช้ token จาก store
  const [tracking, setTracking] = useState(null); // สถานะของข้อมูลการติดตาม
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล

  useEffect(() => {
    if (orderId && token) {
      fetchOrderTracking(orderId, token); // เมื่อมี orderId และ token ให้เรียกฟังก์ชัน fetch ข้อมูลการติดตาม
    }
  }, [orderId, token]);

  const fetchOrderTracking = async (orderId, token) => {
    try {
      setLoading(true);
      const res = await getOrderTracking(token, orderId); // เรียก API ดึงข้อมูลการติดตาม
      setTracking(res.data); // ตั้งค่าข้อมูลการติดตามที่ได้รับ
    } catch (err) {
      toast.error("ไม่สามารถโหลดข้อมูลการติดตามได้");
    } finally {
      setLoading(false); // ปิดสถานะการโหลด
    }
  };

  if (loading) return <p className="text-center">⏳ กำลังโหลดข้อมูลการติดตาม...</p>;
  if (!tracking) return <p className="text-center text-red-500">❌ ไม่พบข้อมูลการติดตาม</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-xl font-bold text-center mb-4">ข้อมูลการติดตามออเดอร์</h2>
      <div className="border p-4 rounded-md">
        <p><strong>เลขพัสดุ:</strong> {tracking.trackingNumber || "ยังไม่มีเลขพัสดุ"}</p>
        <p><strong>บริษัทขนส่ง:</strong> {tracking.shippingCompany || "ยังไม่เลือกบริษัทขนส่ง"}</p>
      </div>
    </div>
  );
};

export default OrderTracking;
