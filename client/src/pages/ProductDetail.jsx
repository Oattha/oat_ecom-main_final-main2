import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import useEcomStore from "../store/ecom-store"; // ✅ นำเข้า store

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart); // ✅ ใช้ Zustand

  useEffect(() => {
    axios.get(`http://localhost:5001/api/product/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
    </div>
  );

  if (!product) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-red-500 text-lg font-semibold">Product not found</p>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">
        
        {/* ✅ รูปภาพสินค้า */}
        <div className="w-full">
          {product.images && product.images.length > 0 ? (
            <>
              <div className="w-full">
                <img 
                  src={product.images[0].url} 
                  className="w-full h-96 object-cover rounded-lg shadow-md"
                  alt={product.title}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.map((img, index) => (
                  <img 
                    key={index} 
                    src={img.url} 
                    className="w-full h-24 object-cover rounded-md shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    alt={`Product image ${index + 1}`}
                    onClick={() => setSelectedImage(img.url)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">No Images Available</p>
          )}
        </div>

        {/* ✅ รายละเอียดสินค้า (ชิดซ้าย) */}
        <div className="mt-6 text-left">
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-600 text-lg mt-2">{product.description}</p>
          <p className="text-2xl font-semibold text-blue-500 mt-4">฿{product.price}</p>

          {/* ✅ ปุ่มเพิ่มลงตะกร้า */}
          <button
            onClick={() => actionAddtoCart(product)}
            className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-md transition"
          >
            <ShoppingCart className="mr-2" /> เพิ่มลงตะกร้า
          </button>
        </div>

      </div>

      {/* ✅ Modal แสดงภาพเต็ม */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img 
              src={selectedImage} 
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              alt="Full size product"
            />
            <button 
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
              onClick={() => setSelectedImage(null)}
            >
              ❌
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
