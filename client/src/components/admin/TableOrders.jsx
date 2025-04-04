import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ นำเข้า Link
import { getOrdersAdmin, changeOrderStatus } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const TableOrders = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    handleGetOrder(token);
  }, []);

  const handleGetOrder = (token) => {
    getOrdersAdmin(token)
      .then((res) => {
        console.log(res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeOrderStatus = (token, orderId, orderStatus) => {
    changeOrderStatus(token, orderId, orderStatus)
      .then((res) => {
        toast.success("Update Status Success!!!");
        handleGetOrder(token);
      })
      .catch((err) => {
        console.log(err);
      });
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
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 border">
              <th>ลำดับ</th>
              <th>ที่อยู่</th>
              <th>วันที่</th>
              <th>สินค้า</th>
              <th>รวม</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
              <th>รายละเอียด</th> {/* ✅ เพิ่มหัวข้อคอลัมน์ใหม่ */}
            </tr>
          </thead>

          <tbody>
            {orders?.map((item, index) => (
              <tr key={item.id} className="border">
                <td className="text-center">{index + 1}</td>
                <td>
                  <p>{item.orderedBy.name}</p>
                  <p>{item.orderedBy.phone}</p>
                  <p>{item.orderedBy.address}</p>
                </td>
                <td>{dateFormat(item.createdAt)}</td>
                <td className="px-2 py-4">
                  {item.products?.map((product, index) => (
                    <li key={index}>
                      {product.product.title}{" "}
                      <span className="text-sm">
                        {product.count} x {numberFormat(product.product.price)}
                      </span>
                    </li>
                  ))}
                </td>
                <td>{numberFormat(item.cartTotal)}</td>
                <td>
                  <span
                    className={`${getStatusColor(item.orderStatus)} px-2 py-1 rounded-full`}
                  >
                    {item.orderStatus}
                  </span>
                </td>
                <td>
                  <select
                    value={item.orderStatus}
                    onChange={(e) =>
                      handleChangeOrderStatus(token, item.id, e.target.value)
                    }
                  >
                    <option>Not Process</option>
                    <option>Processing</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td className="text-center">
                  <Link
                    to={`/admin/orders/${item.id}`} // เปลี่ยน "order" เป็น "orders"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    จัดการการจัดส่ง
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default TableOrders;
