import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCategory } from "../api/Category";
import { listProduct, searchFilters } from "../api/product";
import _ from "lodash";

const ecomStore = (set, get) => ({
  user: null,
  token: null,
  categories: [],
  products: [],
  carts: [],
  orderUpdates: [],  // เพิ่มสถานะสำหรับเก็บการอัปเดตการสั่งซื้อ
  user: JSON.parse(localStorage.getItem("ecom-store"))?.user || null,
  token: JSON.parse(localStorage.getItem("ecom-store"))?.token || null,

  // ฟังก์ชันสำหรับออกจากระบบ
  logout: () => {
    set({
      user: null,
      token: null,
      categories: [],
      products: [],
      carts: [],
      orderUpdates: [],  // ล้างข้อมูลการอัปเดต
      setOrderUpdates: (updates) => set((state) => ({ orderUpdates: updates })),
    });
    // ลบข้อมูลที่เก็บใน localStorage
    localStorage.removeItem("ecom-store");
  },

  // ฟังก์ชันการเพิ่มสินค้าลงในตะกร้า
  actionAddtoCart: (product) => {
    const carts = get().carts;
    const updateCart = [...carts, { ...product, count: 1 }];
    const uniqe = _.unionWith(updateCart, _.isEqual);
    set({ carts: uniqe });
  },

  // ฟังก์ชันการอัปเดตจำนวนสินค้าในตะกร้า
  actionUpdateQuantity: (productId, newQuantity) => {
    set((state) => ({
      carts: state.carts.map((item) =>
        item.id === productId
          ? { ...item, count: Math.max(1, newQuantity) }
          : item
      ),
    }));
  },

  // ฟังก์ชันการลบสินค้าจากตะกร้า
  actionRemoveProduct: (productId) => {
    set((state) => ({
      carts: state.carts.filter((item) => item.id !== productId),
    }));
  },

  // ฟังก์ชันคำนวณราคารวมของตะกร้า
  getTotalPrice: () => {
    return get().carts.reduce((total, item) => {
      return total + item.price * item.count;
    }, 0);
  },

  // ฟังก์ชันการล็อกอิน
  actionLogin: async (form) => {
    const res = await axios.post("http://localhost:5001/api/login", form);
    set({
      user: res.data.payload,
      token: res.data.token,
    });

    // เก็บข้อมูลใน localStorage
    localStorage.setItem("ecom-store", JSON.stringify(get()));
    return res;
  },

  // ฟังก์ชันดึงหมวดหมู่สินค้า
  getCategory: async () => {
    try {
      const res = await listCategory();
      set({ categories: res.data });
    } catch (err) {
      console.log(err);
    }
  },

  // ฟังก์ชันดึงข้อมูลสินค้าทั้งหมด
  getProduct: async (count) => {
    try {
      const res = await listProduct(count);
      set({ products: res.data });
    } catch (err) {
      console.log(err);
    }
  },

  // ฟังก์ชันค้นหาสินค้าตามเงื่อนไข
  actionSearchFilters: async (arg) => {
    try {
      const res = await searchFilters(arg);
      set({ products: res.data });
    } catch (err) {
      console.log(err);
    }
  },

  // ฟังก์ชันเคลียร์ตะกร้า
  clearCart: () => set({ carts: [] }),

  // ฟังก์ชันอัปเดตสถานะคำสั่งซื้อ
  updateOrderStatus: (update) => {
    set((state) => ({
      orderUpdates: [...state.orderUpdates, update],
    }));
  },

  // ฟังก์ชันรีเซ็ตสถานะคำสั่งซื้อเมื่อผู้ใช้ออกจากระบบ
  resetOrderUpdates: () => {
    set({ orderUpdates: [] });
  },
});

// ตั้งค่าการใช้ localStorage สำหรับ persist
const usePersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
};

// สร้าง store ที่ใช้ Zustand และ middleware สำหรับ persist
const useEcomStore = create(persist(ecomStore, usePersist,));

// ตรวจสอบข้อมูลใน localStorage เมื่อแอปโหลด
useEcomStore.subscribe((state) => {
  if (state.user) {
    console.log("User is logged in:", state.user);
  } else {
    console.log("No user data found in store.");
  }
});



export default useEcomStore;
