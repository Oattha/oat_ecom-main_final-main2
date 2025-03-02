// rafce
import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import Uploadfile from "./Uploadfile";
import { Link } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const initialState = {
  title: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  images: [],
};
const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  // console.log(products)

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: [],
  });

  useEffect(() => {
    // code
    getCategory();
    getProduct(100);
  }, []);

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(token, form);
      console.log(res);
      setForm(initialState);
      getProduct();
      toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("จะลบจริงๆ หรอ")) {
      try {
        // code
        const res = await deleteProduct(token, id);
        console.log(res);
        toast.success("Deleted สินค้าเรียบร้อยแล้ว");
        getProduct();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
<div className="container mx-auto p-4 bg-white shadow-md">
  <form onSubmit={handleSubmit}>
    <h2 className="text-lg font-semibold mb-2">เพิ่มข้อมูลสินค้า</h2>

    <input className="border w-full p-1 text-sm" value={form.title} onChange={handleOnChange} placeholder="Title" name="title" />

    <textarea className="border w-full p-1 text-sm mt-2" value={form.description} onChange={handleOnChange} placeholder="Description" name="description" />

    {/* ✅ เพิ่ม label สำหรับ price */}
    <label className="block font-medium mt-2">ราคา</label>
    <input type="number" className="border w-full p-1 text-sm" value={form.price} onChange={handleOnChange} placeholder="price" name="price" />

    {/* ✅ เพิ่ม label สำหรับ quantity */}
    <label className="block font-medium mt-2">จำนวน</label>
    <input type="number" className="border w-full p-1 text-sm" value={form.quantity} onChange={handleOnChange} placeholder="quantity" name="quantity" />

    <label className="block font-medium mt-2">หมวดหมู่</label>
    <select className="border w-full p-1 text-sm" name="categoryId" onChange={handleOnChange} required value={form.categoryId}>
      <option value="" disabled>กรุณาเลือกหมวดหมู่</option>
      {categories.map((item, index) => (
        <option key={index} value={item.id}>{item.name}</option>
      ))}
    </select>

    <hr />
    <Uploadfile form={form} setForm={setForm} />
    <button className="bg-blue-500 p-2 w-32 rounded-md shadow-md hover:scale-105 hover:-translate-y-1 hover:duration-200">
      เพิ่มสินค้า
    </button>
    <hr />
    <br />

    {/* ✅ ทำให้ตาราง Responsive */}
    <div className="overflow-auto max-w-full">
      <table className="table w-full border">
        <thead>
          <tr className="bg-gray-200 border">
            <th>No.</th>
            <th>รูปภาพ</th>
            <th>ชื่อสินค้า</th>
            <th className="w-64">รายละเอียด</th> {/* ✅ กำหนดความกว้างของคอลัมน์ */}
            <th>ราคา</th>
            <th>คงเหลือ</th>
            <th>ขายได้</th>
            <th>วันที่อัปเดต</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody className="text-base"> {/* เพิ่ม text-base เพื่อขยายขนาดข้อความ */}
  {products.map((item, index) => (
    <tr key={index} className="border-b">
      <th className="p-3">{index + 1}</th>
      <td className="p-3">
        {item.images.length > 0 ? (
          <img className="w-20 h-20 rounded-lg shadow-md" src={item.images[0].url} />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-md flex items-center justify-center shadow-sm">No Image</div>
        )}
      </td>
      <td className="p-3">{item.title}</td>

      {/* ✅ ตัดข้อความยาว + tooltip */}
      <td className="max-w-sm truncate hover:overflow-visible hover:whitespace-normal relative p-3">
        <span className="block truncate w-72" title={item.description}>{item.description}</span>
      </td>

      <td className="p-3">{numberFormat(item.price)}</td>
      <td className="p-3">{item.quantity}</td>
      <td className="p-3">{item.sold}</td>
      <td className="p-3">{dateFormat(item.updatedAt)}</td>
      <td className="flex gap-2 p-3">
        <Link to={`/admin/product/${item.id}`} className="bg-yellow-500 p-2 rounded-md shadow-md hover:scale-105">
          <Pencil />
        </Link>
        <button className="bg-red-500 p-2 rounded-md shadow-md hover:scale-105" onClick={() => handleDelete(item.id)}>
          <Trash />
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  </form>
</div>

  );
};

export default FormProduct;
