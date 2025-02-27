import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetail, updateTrackingNumber } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const { orderId } = useParams(); // ดึง orderId จาก URL
  const token = useEcomStore((state) => state.token); // ใช้ token จาก store
  const [order, setOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState(""); // สถานะเลขพัสดุ
  const [shippingCompany, setShippingCompany] = useState(""); // สถานะบริษัทขนส่ง
  const [loading, setLoading] = useState(true);

  const shippingCompanies = ["Kerry", "Flash Express", "J&T", "DHL", "ไปรษณีย์ไทย"]; // ตัวเลือกบริษัทขนส่ง

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId]);

  const fetchOrderDetail = async (orderId) => {
    try {
      setLoading(true);
      const res = await getOrderDetail(token, orderId);
      setOrder(res.data);
      setTrackingNumber(res.data.orderDetail?.trackingNumber || "");
      setShippingCompany(res.data.orderDetail?.shippingCompany || "");
    } catch (err) {
      toast.error("ไม่สามารถโหลดข้อมูลออเดอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!trackingNumber || !shippingCompany) {
      toast.error("กรุณากรอกเลขพัสดุและเลือกบริษัทขนส่ง");
      return;
    }
  
    try {
      const res = await updateTrackingNumber(token, orderId, trackingNumber, shippingCompany);
      
      if (res.data.message === "Tracking number updated successfully") {
        toast.success("อัปเดตเลขพัสดุเรียบร้อย!");
        setOrder(res.data.orderDetail); // อัปเดตข้อมูลออเดอร์ในสถานะ
        setTrackingNumber(res.data.orderDetail.trackingNumber); // อัปเดตเลขพัสดุ
        setShippingCompany(res.data.orderDetail.shippingCompany); // อัปเดตบริษัทขนส่ง
  
        // อัปเดต global store ด้วยข้อมูลใหม่
        const newOrderUpdate = { orderId, trackingNumber, shippingCompany };
        useEcomStore.getState().setOrderUpdates(prev => [...prev, newOrderUpdate]);
      } else {
        toast.error(`ไม่สามารถอัปเดตเลขพัสดุได้: ${res.data.message}`);
      }
    } catch (err) {
      toast.error(`ไม่สามารถอัปเดตเลขพัสดุได้: ${err.message}`);
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
          placeholder="กรอกเลขพัสดุ"
        />

        <label className="block text-sm font-semibold mt-2">บริษัทขนส่ง</label>
        <select
          value={shippingCompany}
          onChange={(e) => setShippingCompany(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">-- เลือกบริษัทขนส่ง --</option>
          {shippingCompanies.map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>

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
