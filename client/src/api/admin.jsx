import axios from "axios";

// ฟังก์ชันดึงข้อมูลออเดอร์ทั้งหมด
export const getOrdersAdmin = async (token) => {
  return axios.get("http://localhost:5001/api/admin/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ฟังก์ชันเปลี่ยนสถานะออเดอร์
export const changeOrderStatus = async (token, orderId, orderStatus) => {
  return axios.put(
    "http://localhost:5001/api/admin/order-status",
    { orderId, orderStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
export const getListAllUsers = async (token) => {
  return axios.get("http://localhost:5001/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ฟังก์ชันเปลี่ยนสถานะผู้ใช้
export const changeUserStatus = async (token, value) => {
  return axios.post("http://localhost:5001/api/change-status", value, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ฟังก์ชันเปลี่ยนบทบาทผู้ใช้
export const changeUserRole = async (token, value) => {
  return axios.post("http://localhost:5001/api/change-role", value, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ฟังก์ชันอัปเดตเลขพัสดุ (Tracking Number)
// ฟังก์ชันอัปเดตเลขพัสดุ (Tracking Number)
export const updateTrackingNumber = (token, orderId, trackingNumber, shippingCompany) => {
  return axios.post(
    `http://localhost:5001/api/admin/orders/${orderId}/tracking`,
    { trackingNumber, shippingCompany },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};


// ✅ ฟังก์ชันดึงรายละเอียดออเดอร์ (แก้ให้สมบูรณ์)
export const getOrderDetail = (token, orderId) => {
  return axios.get(`http://localhost:5001/api/admin/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getAdminStats = (token) => {
  return axios.get("http://localhost:5001/api/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then(response => {
    console.log("Response from API: ", response);  // เพิ่ม log เพื่อดูข้อมูลที่ได้รับ
    return response;
  })
  .catch(error => {
    console.error("API Error: ", error);  // เพิ่ม log ในกรณีที่เกิดข้อผิดพลาด
    throw error;  // เพื่อให้สามารถ catch ใน component ได้
  });
};


getAdminStats