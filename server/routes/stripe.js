const express = require("express");
const { authCheck } = require("../middlewares/authCheck");
const router = express.Router();
const { payment } = require("../controllers/stripe");

router.post("/user/create-payment-intent", authCheck, async (req, res, next) => {
    console.log("🔍 Route accessed: /user/create-payment-intent"); // เช็คว่ามีการเรียก API มาจริงไหม
    try {
        await payment(req, res, next);
    } catch (err) {
        console.error("❌ Error in /user/create-payment-intent:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
