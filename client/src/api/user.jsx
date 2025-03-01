import axios from "axios";

// ตั้งค่าฐาน URL จาก environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const createUserCart = async (token, cart) => {
  return axios.post(`${API_URL}/user/cart`, cart, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listUserCart = async (token) => {
  return axios.get(`${API_URL}/user/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// แก้ไข saveAddress ให้รองรับข้อมูลชื่อ, เบอร์โทร, ที่อยู่
export const saveAddress = async (token, { name, phone, address }) => {
  return axios.post(
    `${API_URL}/user/address`,
    { name, phone, address },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// ฟังก์ชันสำหรับการบันทึกคำสั่งซื้อใหม่
export const saveOrder = async (token, payload) => {
  return axios.post(`${API_URL}/user/order`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getOrders = async (token) => {
  return axios.get(`${API_URL}/user/order`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ดึงข้อมูลผู้ใช้ปัจจุบัน
export const getCurrentUser = async (token) => {
  return axios.get(`${API_URL}/current-user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูลผู้ใช้ (ชื่อ, เบอร์โทร, ที่อยู่)
export const updateUser = async (token, userData) => {
  return axios.put(`${API_URL}/user/update`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ฟังก์ชันสำหรับการบันทึกข้อมูลผู้ใช้ใหม่
export const saveUserInfo = async (token, name, phone, address) => {
  return axios.post(
    `${API_URL}/user/info`,
    { name, phone, address },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// ฟังก์ชันดึงข้อมูลการติดตามออเดอร์
export const getOrderTracking = async (token) => {
  return axios.get(`${API_URL}/user/orders/tracking`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// ฟังก์ชันสำหรับการอัปเดตข้อมูลการจัดส่งใน OrderDetail

export const createOrderDetail = async (token, { orderId, name, phone, address }) => {
  return axios.post(
    `${API_URL}/order-detail/create`, // ✅ เปลี่ยน URL ให้ถูกต้อง
    { orderId, name, phone, address }, 
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};




export const createOrder = (token, orderData) => {
  return axios.post(`${API_URL}/user/order`, saveOrder, {
    headers: { Authorization: `Bearer ${token}` },
  });
};