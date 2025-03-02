import React, { useEffect, useState } from "react";
import { listProductBy } from "../../api/product";
import ProductCard from "../card/ProductCard";
import SwiperShowProduct from "../../utils/SwiperShowProduct";
import { SwiperSlide } from "swiper/react";

const BestSeller = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await listProductBy("sold", "desc", 12);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching best sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500 text-lg">⏳ กำลังโหลดสินค้าขายดี...</p>
        </div>
      ) : (
        <SwiperShowProduct>
          {data?.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard item={item} />
            </SwiperSlide>
          ))}
        </SwiperShowProduct>
      )}
    </div>
  );
};

export default BestSeller;
