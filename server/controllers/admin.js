const prisma = require("../config/prisma");

// ✅ เปลี่ยนสถานะออเดอร์
exports.changeOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        const orderUpdate = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { orderStatus: orderStatus },
        });

        res.json(orderUpdate);
    } catch (err) {
        console.log("Error updating order status:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ ดึงข้อมูลออเดอร์ทั้งหมด
exports.getOrderAdmin = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
                orderedBy: {
                    select: {
                        id: true,
                        email: true,
                        address: true,
                    },
                },
            },
        });

        res.json(orders);
    } catch (err) {
        console.log("Error fetching orders:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ ดึงรายละเอียดของออเดอร์ (ใช้ orderId)
exports.getOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: {
                orderedBy: {
                    select: {
                        id: true,
                        email: true,
                        name: true, // ✅ ต้องเพิ่ม name
                        phone: true, // เพิ่ม phone
                        address: true,
                    },
                },
                products: {
                    include: { product: true },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(order);
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ อัปเดตเลขพัสดุ (Tracking Number)
exports.updateTrackingNumber = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { trackingNumber } = req.body;

        const order = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { trackingNumber },
        });

        res.json({ message: "Tracking number updated", order });
    } catch (err) {
        console.error("Error updating tracking number:", err);
        res.status(500).json({ message: "Server error" });
    }
};
