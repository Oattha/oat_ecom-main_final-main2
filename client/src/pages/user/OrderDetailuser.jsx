import React, { useState, useEffect } from "react";
import { getOrders, getOrderTracking } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { dateFormat } from "../../utils/dateformat";
import { numberFormat } from "../../utils/number";

const OrderDetailuser = () => {
  const token = useEcomStore((state) => state.token);
  const orderUpdates = useEcomStore((state) => state.orderUpdates);
  const setOrderUpdates = useEcomStore((state) => state.setOrderUpdates);

  const [orders, setOrders] = useState([]);
  const [trackingInfo, setTrackingInfo] = useState({});
  const [previousOrders, setPreviousOrders] = useState([]); // เก็บค่าเดิมของ orders

  useEffect(() => {
    hdlGetOrders(token);
  }, []);

  useEffect(() => {
    if (previousOrders.length > 0) {
      const updatedOrders = orders.filter(
        (newOrder) =>
          !previousOrders.some(
            (oldOrder) =>
              oldOrder.id === newOrder.id &&
              oldOrder.orderStatus === newOrder.orderStatus
          )
      );

      if (updatedOrders.length > 0) {
        setOrderUpdates(updatedOrders.map((order) => order.id));
      }
    }

    setPreviousOrders(orders);
  }, [orders]);

  const hdlGetOrders = (token) => {
    getOrders(token)
      .then((res) => {
        setOrders(res.data.orders);
        fetchTrackingInfo(token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrackingInfo = async (token) => {
    try {
      const res = await getOrderTracking(token);
      const trackingData = res.data;
      const trackingInfoObj = trackingData.reduce((acc, info) => {
        acc[info.orderId] = info;
        return acc;
      }, {});

      setTrackingInfo(trackingInfoObj);
    } catch (error) {
      console.log("Error fetching tracking:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ประวัติการสั่งซื้อ</h1>
      <div className="space-y-4">
        {orders?.map((item, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-sm">Order date</p>
                <p className="font-bold">{dateFormat(item.updatedAt)}</p>
              </div>
              <div>
                <span className="px-2 py-1 rounded-full bg-blue-200">
                  {item.orderStatus}
                </span>
              </div>
            </div>
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
                  {item.products?.map((product, index) => (
                    <tr key={index}>
                      <td>{product.product.title}</td>
                      <td>{numberFormat(product.product.price)}</td>
                      <td>{product.count}</td>
                      <td>
                        {numberFormat(product.count * product.product.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right">
              <p>ราคาสุทธิ</p>
              <p>{numberFormat(item.cartTotal)}</p>
            </div>
            <div>
              {trackingInfo[item.id] ? (
                <div>
                  <p>📦 Tracking: {trackingInfo[item.id].trackingNumber}</p>
                  <p>🚚 บริษัทขนส่ง: {trackingInfo[item.id].shippingCompany}</p>
                  <p>🏠 ที่อยู่: {trackingInfo[item.id].address}</p>
                  <p>📞 เบอร์โทร: {trackingInfo[item.id].phone}</p>
                  <p>👤 ชื่อผู้สั่งซื้อ: {trackingInfo[item.id].name}</p>
                </div>
              ) : (
                <p>📦 กำลังโหลดเลขพัสดุ...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailuser;
