import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../../api/admin';  // นำเข้า getAdminStats
import { ShoppingCart, Users, Package } from 'lucide-react';  // สำหรับไอคอน
import { useNavigate } from 'react-router-dom';  // นำเข้า useNavigate

const Dashboard = () => {
  const navigate = useNavigate();  // สร้างตัวแปร navigate
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getAdminStats(token)
        .then((res) => {
          setStats(res.data);
        })
        .catch((err) => {
          console.error("Error fetching admin stats:", err);
        });
    } else {
      console.error("No token found. Please log in.");
      // ถ้าไม่มี token ให้พาผู้ใช้ไปหน้า login
      navigate('/login');  // เพิ่มการนำทางไปที่หน้า login
    }
  }, [navigate]);  // ตรวจสอบการเปลี่ยนแปลงของ navigate

  return (
    <div className="grid gap-6 p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* คำสั่งซื้อทั้งหมด */}
        <div className="bg-white p-4 shadow-md rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">คำสั่งซื้อทั้งหมด</h2>
            <p className="text-xl font-bold">{stats.totalOrders}</p>
          </div>
          <ShoppingCart size={32} />
        </div>

        {/* ลูกค้าทั้งหมด */}
        <div className="bg-white p-4 shadow-md rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">ลูกค้าทั้งหมด</h2>
            <p className="text-xl font-bold">{stats.totalUsers}</p>
          </div>
          <Users size={32} />
        </div>

        {/* สินค้าคงคลัง */}
        <div className="bg-white p-4 shadow-md rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">สินค้าคงคลัง</h2>
            <p className="text-xl font-bold">{stats.totalProducts}</p>
          </div>
          <Package size={32} />
        </div>
      </div>

      {/* ยอดขายรวม */}
      <div className="bg-white p-4 shadow-md rounded-lg mt-4">
        <h2 className="text-lg font-semibold">ยอดขายรวม</h2>
        <p className="text-xl font-bold">${stats.totalSales}</p>
      </div>
    </div>
  );
};

export default Dashboard;
