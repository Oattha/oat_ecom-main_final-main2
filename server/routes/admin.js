const express = require('express');
const { authCheck } = require('../middlewares/authCheck');
const router = express.Router();

// import controllers
const { getOrderAdmin, changeOrderStatus, getOrderDetail, updateTrackingNumber } = require('../controllers/admin');

// API ดึงออเดอร์ทั้งหมด (มีอยู่แล้ว)
router.get('/admin/orders', authCheck, getOrderAdmin);

// API เปลี่ยนสถานะออเดอร์ (มีอยู่แล้ว)
router.put('/admin/order-status', authCheck, changeOrderStatus);

// ✅ **เพิ่ม API ดึงรายละเอียดออเดอร์ ตาม orderId**
router.get('/admin/orders/:orderId', authCheck, getOrderDetail);

// ✅ **เพิ่ม API สำหรับอัปเดต trackingNumber**
router.post('/orders/:orderId/tracking', authCheck, updateTrackingNumber);

module.exports = router;
