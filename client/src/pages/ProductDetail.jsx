import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams(); // ✅ ดึง id จาก URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    axios.get(`http://localhost:5001/api/product/${id}`) // ✅ แก้ URL ให้ถูกต้อง
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-lg font-semibold">฿{product.price}</p>

      {/* ✅ แสดงรูปภาพทั้งหมด */}
      <div className="flex gap-2 mt-4">
        {product.images && product.images.length > 0 ? (
          product.images.map((img) => (
            <img key={img.id} src={img.url} className="w-32 h-32 object-cover rounded-md shadow" />
          ))
        ) : (
          <p>No Images</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
