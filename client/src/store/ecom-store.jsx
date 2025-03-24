import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCategory } from "../api/Category";
import { listProduct, searchFilters } from "../api/product";
import _ from "lodash";

const useEcomStore = create(
  persist(
    (set, get) => ({
      user: JSON.parse(localStorage.getItem("ecom-store"))?.user || null,
      token: JSON.parse(localStorage.getItem("ecom-store"))?.token || null,
      categories: [],
      products: [],
      carts: [],
      orderUpdates: [],

      // ✅ เพิ่มฟังก์ชัน setToken
      setToken: (token) => {
        set({ token });
        localStorage.setItem("ecom-store", JSON.stringify(get()));
      },

      // ✅ เพิ่มฟังก์ชัน setUser
      setUser: (user) => {
        set({ user });
        localStorage.setItem("ecom-store", JSON.stringify(get()));
      },

      // ออกจากระบบ
      logout: () => {
        set({
          user: null,
          token: null,
          categories: [],
          products: [],
          carts: [],
          orderUpdates: [],
        });
        localStorage.removeItem("ecom-store");
      },

      // เพิ่มสินค้าลงตะกร้า
      actionAddtoCart: (product) => {
        const carts = get().carts;
        const updateCart = [...carts, { ...product, count: 1 }];
        const uniqueCart = _.unionWith(updateCart, _.isEqual);
        set({ carts: uniqueCart });
      },

      // อัปเดตจำนวนสินค้าในตะกร้า
      actionUpdateQuantity: (productId, newQuantity) => {
        set((state) => ({
          carts: state.carts.map((item) =>
            item.id === productId ? { ...item, count: Math.max(1, newQuantity) } : item
          ),
        }));
      },

      // ลบสินค้าออกจากตะกร้า
      actionRemoveProduct: (productId) => {
        set((state) => ({
          carts: state.carts.filter((item) => item.id !== productId),
        }));
      },

      // คำนวณราคารวม
      getTotalPrice: () => {
        return get().carts.reduce((total, item) => total + item.price * item.count, 0);
      },

      // ล็อกอิน
      actionLogin: async (form) => {
        try {
          const res = await axios.post("http://localhost:5001/api/login", form);
          set({ user: res.data.payload, token: res.data.token });
          localStorage.setItem("ecom-store", JSON.stringify(get()));
          return res;
        } catch (err) {
          console.error("Login failed:", err);
          throw err;
        }
      },

      // ดึงหมวดหมู่สินค้า
      getCategory: async () => {
        try {
          const res = await listCategory();
          set({ categories: res.data });
        } catch (err) {
          console.error(err);
        }
      },

      // ดึงข้อมูลสินค้า
      getProduct: async (count) => {
        try {
          const res = await listProduct(count);
          set({ products: res.data });
        } catch (err) {
          console.error(err);
        }
      },

      // ค้นหาสินค้า
      actionSearchFilters: async (arg) => {
        try {
          const res = await searchFilters(arg);
          set({ products: res.data });
        } catch (err) {
          console.error(err);
        }
      },

      // เคลียร์ตะกร้า
      clearCart: () => set({ carts: [] }),

      // อัปเดตสถานะคำสั่งซื้อ
      updateOrderStatus: (update) => {
        set((state) => ({ orderUpdates: [...state.orderUpdates, update] }));
      },

      // รีเซ็ตสถานะคำสั่งซื้อ
      resetOrderUpdates: () => set({ orderUpdates: [] }),
    }),
    {
      name: "ecom-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ตรวจสอบข้อมูลใน localStorage
useEcomStore.subscribe((state) => {
  console.log(state.user ? "User is logged in:" : "No user data found in store.", state.user);
});

export default useEcomStore;
