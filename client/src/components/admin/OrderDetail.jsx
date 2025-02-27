import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetail, updateTrackingNumber } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const { orderId } = useParams(); // ✅ เปลี่ยนจาก id เป็น orderId ให้ตรงกับ AppRoutes.jsx
  const token = useEcomStore((state) => state.token);
  const [order, setOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Current URL Path:", window.location.pathname);
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId]);

  const fetchOrderDetail = async (orderId) => {
    try {
      setLoading(true);
      const res = await getOrderDetail(token, orderId);
      console.log("🔍 ข้อมูลออเดอร์ที่ได้รับ:", res.data); // ✅ เช็คว่ามี orderedBy ไหม
      setOrder(res.data);
      setTrackingNumber(res.data.trackingNumber || "");
    } catch (err) {
      console.error("Error fetching order details:", err);
      toast.error("ไม่สามารถโหลดข้อมูลออเดอร์ได้");
    } finally {
      setLoading(false);
    }
  };
  

  const handleUpdateTracking = async () => {
    try {
      await updateTrackingNumber(token, orderId, trackingNumber);
      toast.success("อัปเดตเลขพัสดุเรียบร้อย!");
      fetchOrderDetail(orderId);
    } catch (err) {
      console.error("Error updating tracking number:", err);
      toast.error("ไม่สามารถอัปเดตเลขพัสดุได้");
    }
  };

  if (loading) return <p className="text-center">⏳ กำลังโหลดข้อมูลออเดอร์...</p>;
  if (!order) return <p className="text-center text-red-500">❌ ไม่พบข้อมูลออเดอร์</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-xl font-bold text-center mb-4">รายละเอียดออเดอร์</h2>
      <div className="border p-4 rounded-md">
        <p><strong>ชื่อผู้สั่ง:</strong> {order?.orderedBy?.name || "ไม่ระบุ"}</p>
        <p><strong>เบอร์โทร:</strong> {order?.orderedBy?.phone || "ไม่ระบุ"}</p>
        <p><strong>ที่อยู่:</strong> {order?.orderedBy?.address || "ไม่ระบุ"}</p>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-semibold">เลขพัสดุ</label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleUpdateTracking}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          อัปเดตเลขพัสดุ
        </button>
      </div>
    </div>
  );
};

export { OrderDetail };

