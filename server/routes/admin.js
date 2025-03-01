const express = require('express');
const { authCheck } = require('../middlewares/authCheck');
const router = express.Router();

// import controllers
const { 
    getOrderAdmin, 
    changeOrderStatus, 
    getOrderDetail, 
    updateTrackingNumber,
    getOrderTrackingAdmin,
    getAdminStats  
} = require('../controllers/admin');

// API ดึงออเดอร์ทั้งหมด (มีอยู่แล้ว)
router.get('/admin/orders', authCheck, getOrderAdmin);

// API เปลี่ยนสถานะออเดอร์ (มีอยู่แล้ว)
router.put('/admin/order-status', authCheck, changeOrderStatus);

// ✅ **เพิ่ม API ดึงรายละเอียดออเดอร์ ตาม orderId**
router.get('/admin/orders/:orderId', authCheck, getOrderDetail);
router.post('/admin/orders/:orderId', authCheck, getOrderDetail);
// ✅ **เพิ่ม API สำหรับอัปเดต trackingNumber**
router.put('/admin/orders/:orderId/tracking', authCheck, updateTrackingNumber);  // ฟังก์ชันนี้จะเป็นการเพิ่มข้อมูล trackingNumber และ shippingCompany
router.post('/admin/orders/:orderId/tracking', authCheck, updateTrackingNumber);

/*router.get("/admin/orders/tracking", authCheck, getOrderTrackingAdmin);*/
router.get("/admin/stats",authCheck, getAdminStats);
module.exports = router;
