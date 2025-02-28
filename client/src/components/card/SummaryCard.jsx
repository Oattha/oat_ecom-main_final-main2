import React, { useState, useEffect } from "react";
import { listUserCart, saveAddress } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { numberFormat } from "../../utils/number";

const SummaryCard = () => {
  const token = useEcomStore((state) => state.token);
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    hdlGetUserCart(token);
  }, []);

  const hdlGetUserCart = (token) => {
    listUserCart(token)
      .then((res) => {
        setProducts(res.data.products);
        setCartTotal(res.data.cartTotal);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hdlGoToPayment = () => {
    navigate("/user/payment");
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-wrap gap-4">
        <div className="w-2/4">
          <div className="bg-gray-100 p-4 rounded-md border shadow-md space-y-4">
            <h1 className="text-lg font-bold">คำสั่งซื้อของคุณ</h1>

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
