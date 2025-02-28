import React, { useState, useEffect } from "react";
import { listUserCart, saveAddress, getCurrentUser, updateUser } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { numberFormat } from "../../utils/number";

const SummaryCard = () => {
  const token = useEcomStore((state) => state.token);
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [name, setName] = useState(""); // เพิ่ม state ชื่อ
  const [phone, setPhone] = useState(""); // เพิ่ม state เบอร์โทร
  const [address, setAddress] = useState(""); // เพิ่ม state ที่อยู่
  const [addressSaved, setAddressSaved] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    hdlGetUserCart(token);
    hdlGetUserInfo(token);
  }, [token]);

  const hdlGetUserCart = (token) => {
    listUserCart(token)
      .then((res) => {
        setProducts(res.data.products);
        setCartTotal(res.data.cartTotal);
      })
      .catch((err) => console.log(err));
  };

  // ดึงข้อมูล user (ชื่อ, เบอร์โทร, ที่อยู่)
  const hdlGetUserInfo = (token) => {
    getCurrentUser(token)
      .then((res) => {
        setName(res.data.name || ""); // แก้ไขให้ตรงกับ response
        setPhone(res.data.phone || "");
        setAddress(res.data.address || "");
      })
      .catch((err) => console.log(err));
  };

  // บันทึกข้อมูลที่อยู่, ชื่อ, เบอร์โทร
  const hdlSaveAddress = () => {
    if (!name || !phone || !address) {
      return toast.warning("กรุณากรอกข้อมูลให้ครบ");
    }

    updateUser(token, { name, phone, address })
      .then((res) => {
        toast.success(res.data.message);
        setAddressSaved(true);
      })
      .catch((err) => console.log(err));
  };

  const hdlGoToPayment = () => {
    if (!addressSaved) {
      return toast.warning("กรุณากรอกข้อมูลให้ครบก่อน");
    }
    navigate("/user/payment");
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-wrap gap-4">
        {/* Left */}
        <div className="w-2/4">
          <div className="bg-gray-100 p-4 rounded-md border shadow-md space-y-4">
            <h1 className="font-bold text-lg">ที่อยู่ในการจัดส่ง</h1>
            
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรุณากรอกชื่อ"
              className="w-full px-2 py-1 rounded-md border"
            />

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="กรุณากรอกเบอร์โทร"
              className="w-full px-2 py-1 rounded-md border"
            />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="กรุณากรอกที่อยู่"
              className="w-full px-2 py-1 rounded-md border"
            />

            <button
              onClick={hdlSaveAddress}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 hover:scale-105"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="w-2/4">
          <div className="bg-gray-100 p-4 rounded-md border shadow-md space-y-4">
            <h1 className="text-lg font-bold">คำสั่งซื้อของคุณ</h1>

            {/* Item List */}
            {products?.map((item, index) => (
              <div key={index} className="flex justify-between items-end">
                <div>
                  <p className="font-bold">{item.product.title}</p>
                  <p className="text-sm">
                    จำนวน : {item.count} x {numberFormat(item.product.price)}
                  </p>
                </div>
                <p className="text-red-500 font-bold">
                  {numberFormat(item.count * item.product.price)}
                </p>
              </div>
            ))}

            <div>
              <div className="flex justify-between">
                <p>ค่าจัดส่ง:</p>
                <p>0.00</p>
              </div>
              <div className="flex justify-between">
                <p>ส่วนลด:</p>
                <p>0.00</p>
              </div>
            </div>

            <hr />
            <div className="flex justify-between">
              <p className="font-bold">ยอดรวมสุทธิ:</p>
              <p className="text-red-500 font-bold text-lg">{numberFormat(cartTotal)}</p>
            </div>

            <hr />
            <button
              onClick={hdlGoToPayment}
              className="bg-green-400 w-full p-2 rounded-md shadow-md text-white hover:bg-green-600"
            >
              ดำเนินการชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
