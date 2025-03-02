const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, phone, email, password, address, role } = req.body; // ✅ เพิ่ม address

        if (!name || !phone || !email || !password || !address) { // ✅ ตรวจสอบให้ครบ
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
        }

        const user = await prisma.user.findFirst({
            where: { email: email }
        });

        if (user) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name: name,
                phone: phone,
                email: email,
                password: hashPassword,
                address: address, // ✅ บันทึกที่อยู่
                role: role || "user",
                enabled: true
            }
        });

        res.send('Register Success');
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findFirst({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).json({ message: 'User Not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password Invalid!' });
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const SECRET_KEY = process.env.SECRET || "defaultsecret";

        jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Server Error" });
            }
            res.json({ payload, token });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.currentUser = async (req, res) => {
    try {
        console.log("🔹 req.user:", req.user); // ➜ ดูว่า req.user มีค่าไหม
        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: "User not found in request" });
        }
  
        const user = await prisma.user.findFirst({
            where: { email: req.user.email },
            select: { id: true, name: true, phone: true, email: true, role: true, address: true }
        });
  
        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }
  
        res.json({ user });
    } catch (err) {
        console.log("❌ Error fetching current user:", err);
        res.status(500).json({ message: 'Internal server error', error: err });
    }
  };
  


