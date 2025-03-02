import React, { useEffect, useState } from "react";
import { listProductBy } from "../../api/product";
import ProductCard from "../card/ProductCard";
import SwiperShowProduct from "../../utils/SwiperShowProduct";
import { SwiperSlide } from "swiper/react";

const NewProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await listProductBy("updatedAt", "desc", 12);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching new products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500 text-lg">⏳ กำลังโหลดสินค้าใหม่...</p>
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

export default NewProduct;
