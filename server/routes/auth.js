const express = require('express')
const router = express.Router()
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client("494780159412-hshqvtm31e4o8j17t0fcqq2ltcgtph7l.apps.googleusercontent.com"); // ใส่ Google Client ID

// ✅ Import Controller
const { register, login, currentUser, currentUserGoogle , googlelogin } = require('../controllers/auth')

// ✅ Import Middleware
const { authCheck, adminCheck } = require('../middlewares/authCheck')

// ✅ Route สำหรับสมัครสมาชิก
router.post('/register', register)

// ✅ Route สำหรับเข้าสู่ระบบ
router.post('/login', login)
router.post("/googlelogin", async (req, res) => {
    try {
        console.log("📌 Received token:", req.body.token); // Debug ตรงนี้
        
        if (!req.body.token) {
            console.error("❌ No token received");
            return res.status(400).json({ message: "Token is required" });
        }

        // ✅ ตรวจสอบ token และถอดรหัส
        const SECRET_KEY = process.env.SECRET || "defaultsecret";
        const decoded = jwt.verify(req.body.token, SECRET_KEY);
        console.log("✅ Decoded Token:", decoded);

        // ✅ ตัวอย่างข้อมูล user (อาจจะมาจาก database จริง ๆ)
        const user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        console.log("📌 Returning User Data:", user); // Debug

        res.status(200).json({
            message: "Login successful",
            token: req.body.token, // ✅ คืน token กลับไปด้วย
            user: user // ✅ คืนข้อมูล user
        });
    } catch (error) {
        console.error("❌ Error in /auth/googlelogin:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/google", async (req, res) => {
    try {
        const { tokenId } = req.body;
        if (!tokenId) {
            return res.status(400).json({ message: "Token is required" });
        }

        console.log("📌 Received Google Token:", tokenId);

        // ✅ ตรวจสอบ Token กับ Google
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("📌 Google Payload:", payload);

        const { email, name, picture } = payload;
        let user = await findOrCreateUser(email, name, picture);

        // ✅ ส่ง Token ไปยัง `googlelogin`
        const response = await axios.post("http://localhost:5001/auth/googlelogin", {
            email: user.email,
            password: "" // ไม่ต้องใช้ password สำหรับ Google Login
        });

        res.json(response.data);
    } catch (err) {
        console.error("Google Login Error:", err);
        res.status(500).json({ message: "Google login failed", error: err.message });
    }
});


// ✅ Route สำหรับดึงข้อมูลผู้ใช้ (ต้อง login ก่อน)
router.post('/current-user', authCheck, currentUser)

// ✅ Route สำหรับดึงข้อมูล admin (ต้อง login + เป็น admin)
router.post('/current-admin', authCheck, adminCheck, currentUser)

// ✅ Route สำหรับ Google Login (ใช้ authCheck เพื่อตรวจสอบ token)
router.post('/current-user/google', authCheck, currentUserGoogle)

// เริ่มการล็อกอินด้วย Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback (หลังจากล็อกอินสำเร็จ)
const axios = require("axios");

router.get("/google/callback", passport.authenticate("google", { session: false }), async (req, res) => {
    console.log("📌 req.user:", req.user); // ตรวจสอบค่าที่ได้จาก Google

    if (!req.user) {
        console.error("❌ Authentication failed: req.user is undefined");
        return res.status(401).json({ message: "Authentication failed" });
    }

    const user = req.user.user;  // อาจจะต้องเป็น req.user ตรง ๆ
    console.log("📌 User Data:", user); // ตรวจสอบค่าผู้ใช้ที่ดึงมาได้

    if (!user) {
        console.error("❌ No user data received");
        return res.status(500).json({ message: "No user data received" });
    }

    const SECRET_KEY = process.env.SECRET || "defaultsecret";

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
    console.log("📌 Token Generated:", token);

    // 🔥 เปลี่ยนจาก `res.json(...)` เป็น `res.redirect(...)`
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendURL}/redirect?token=${token}`);
});





// Google Login API
router.post("/google", async (req, res) => {
    try {
        console.log("📌 Received Token:", req.body.tokenId);

        const { tokenId } = req.body;
        if (!tokenId) {
            return res.status(400).json({ message: "Token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("📌 Google Payload:", payload);

        const { email, name, picture } = payload;
        let user = await findOrCreateUser(email, name, picture);

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        console.log("📌 User is logged in:", { id: user.id, email: user.email, role: user.role });
        res.json({ payload: { id: user.id, email: user.email, role: user.role }, token }); // ✅ ส่งแบบเดียวกับ /auth/login
    } catch (err) {
        console.error("Google Login Error:", err);
        res.status(500).json({ message: "Google login failed", error: err.message });
    }
});



// ✅ ส่งออก router ไปใช้ใน server.js
module.exports = router
