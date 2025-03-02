const prisma = require("../config/prisma");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.payment = async (req, res) => {
    try {
        console.log("🔍 เข้ามาในฟังก์ชัน payment()");

        // 1️⃣ ตรวจสอบ Token และ req.user
        if (!req.user || !req.user.id) {
            console.error("⚠️ ไม่พบข้อมูลผู้ใช้ (req.user):", req.user);
            return res.status(400).json({ message: "User not authenticated" });
        }

        console.log("🛒 ค้นหาตะกร้าของ user ID:", req.user.id);

        // 2️⃣ ดึงข้อมูล Cart จาก Database
        const cart = await prisma.cart.findFirst({
            where: { orderedById: req.user.id },
        });

        if (!cart) {
            console.error("⚠️ ไม่พบ Cart ของ user:", req.user.id);
            return res.status(404).json({ message: "Cart not found" });
        }

        console.log("💰 กำลังสร้าง PaymentIntent สำหรับยอดเงิน:", cart.cartTotal * 100);

        // 3️⃣ เรียก Stripe API เพื่อสร้าง PaymentIntent
        /*const paymentIntent = await stripe.paymentIntents.create({
            amount: cart.cartTotal * 100,
            currency: "thb",
            automatic_payment_methods: { enabled: true },
        });*/
        const paymentIntent = await stripe.paymentIntents.create({
          amount: cart.cartTotal * 100,
          currency: "thb",
          payment_method_types: ["card","promptpay"],  // เพิ่มตรงนี้
      });
      

        console.log("✅ สร้าง PaymentIntent สำเร็จ:", paymentIntent.id);
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาดใน payment function:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
