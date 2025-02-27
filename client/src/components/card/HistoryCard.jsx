import React, { useState, useEffect } from "react";
import { getOrders, getOrderTracking } from "../../api/user"; // เพิ่ม getOrderTracking
import useEcomStore from "../../store/ecom-store";
import { dateFormat } from "../../utils/dateformat";
import { numberFormat } from "../../utils/number";

const HistoryCard = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [trackingInfo, setTrackingInfo] = useState({}); // เพิ่ม state สำหรับ trackingNumber, shippingCompany, address และ phone

  useEffect(() => {
    hdlGetOrders(token);
  }, []);

  // ดึงข้อมูลคำสั่งซื้อ
  const hdlGetOrders = (token) => {
    getOrders(token)
      .then((res) => {
        setOrders(res.data.orders);
        res.data.orders.forEach((order) => {
          // เรียกฟังก์ชันเพื่อดึงเลขพัสดุและข้อมูลที่อยู่ เบอร์โทร
          fetchTrackingInfo(order.id);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ฟังก์ชันดึงเลขพัสดุ, บริษัทขนส่ง, ที่อยู่ และเบอร์โทร
  const fetchTrackingInfo = async (orderId) => {
    try {
      const res = await getOrderTracking(token, orderId);
      setTrackingInfo((prev) => ({
        ...prev,
        [orderId]: {
          trackingNumber: res.data.trackingNumber, // เก็บเลขพัสดุตาม orderId
          shippingCompany: res.data.shippingCompany, // เก็บบริษัทขนส่งตาม orderId
          address: res.data.address, // เก็บที่อยู่
          phone: res.data.phone, // เก็บเบอร์โทร
          name: res.data.name, // เก็บชื่อผู้สั่งซื้อ
        },
      }));
    } catch (error) {
      console.log("Error fetching tracking:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Process":
        return "bg-gray-200";
      case "Processing":
        return "bg-blue-200";
      case "Completed":
        return "bg-green-200";
      case "Cancelled":
        return "bg-red-200";
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ประวัติการสั่งซื้อ</h1>
      <div className="space-y-4">
        {orders?.map((item, index) => {
          return (
            <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
              {/* Header */}
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-sm">Order date</p>
                  <p className="font-bold">{dateFormat(item.updatedAt)}</p>
                </div>
                <div>
                  <span
                    className={`${getStatusColor(item.orderStatus)} px-2 py-1 rounded-full`}
                  >
                    {item.orderStatus}
                  </span>
                </div>
              </div>
              {/* Product Details Table */}
              <div>
                <table className="border w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th>สินค้า</th>
                      <th>ราคา</th>
                      <th>จำนวน</th>
                      <th>รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.products?.map((product, index) => {
                      return (
                        <tr key={index}>
                          <td>{product.product.title}</td>
                          <td>{numberFormat(product.product.price)}</td>
                          <td>{product.count}</td>
                          <td>
                            {numberFormat(
                              product.count * product.product.price
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Order Total */}
              <div>
                <div className="text-right">
                  <p>ราคาสุทธิ</p>
                  <p>{numberFormat(item.cartTotal)}</p>
                </div>
              </div>
              {/* Display Tracking Number, Shipping Company, Address, Phone, and User Name */}
              <div>
                {trackingInfo[item.id] ? (
                  <div>
                    <p>📦 Tracking: {trackingInfo[item.id].trackingNumber}</p>
                    <p>🚚 บริษัทขนส่ง: {trackingInfo[item.id].shippingCompany}</p>
                    <p>🏠 ที่อยู่: {trackingInfo[item.id].address}</p>
                    <p>📞 เบอร์โทร: {trackingInfo[item.id].phone}</p>
                    <p>👤 ชื่อผู้สั่งซื้อ: {trackingInfo[item.id].name}</p> {/* แสดงชื่อผู้สั่งซื้อ */}
                  </div>
                ) : (
                  <p>📦 กำลังโหลดเลขพัสดุ...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryCard;
