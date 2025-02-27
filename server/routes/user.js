const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require("../middlewares/authCheck");

const {
    listUsers,
    changeStatus,
    changeRole,
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    saveOrder,
    getOrder,
    saveNameAndPhone,
    getNameAndPhone,
    currentUser,
    updateUser // ✅ เพิ่ม updateUser
} = require('../controllers/user');

router.get('/users', authCheck, adminCheck, listUsers);
router.post('/change-status', authCheck, adminCheck, changeStatus);
router.post('/change-role', authCheck, adminCheck, changeRole);

router.post('/user/cart', authCheck, userCart);
router.get('/user/cart', authCheck, getUserCart);
router.delete('/user/cart', authCheck, emptyCart);

router.post('/user/address', authCheck, saveAddress);

router.post('/user/order', authCheck, saveOrder);
router.get('/user/order', authCheck, getOrder);

router.post('/user/name-phone', authCheck, saveNameAndPhone);
router.get('/user/name-phone', authCheck, getNameAndPhone);

router.get("/current-user", authCheck, currentUser);

// ✅ ตอนนี้ updateUser จะถูกใช้งานได้
router.put("/user/update", authCheck, updateUser);

module.exports = router;
