const prisma = require("../config/prisma");

// ✅ เปลี่ยนสถานะออเดอร์
exports.changeOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        if (!orderId || !orderStatus) {
            return res.status(400).json({ error: "orderId and orderStatus are required" });
        }

        const orderUpdate = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { orderStatus: orderStatus },
        });

        res.json(orderUpdate);
    } catch (err) {
        console.error("Error updating order status:", err);
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
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ ดึงรายละเอียดของออเดอร์ (ใช้ orderId)
exports.getOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ error: "orderId is required" });
        }

        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: {
                orderedBy: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        address: true,
                    },
                },
                orderDetail: {
                    select: {
                        trackingNumber: true,
                        shippingCompany: true,
                        name: true,  // ✅ เพิ่มฟิลด์ name
                        phone: true, // ✅ เพิ่มฟิลด์ phone
                        address: true // ✅ เพิ่มฟิลด์ address
                    },
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
        const { orderId } = req.params; // orderId จาก URL
        const { trackingNumber, shippingCompany } = req.body; // ข้อมูลจาก body

        console.log("Received orderId:", orderId);
        console.log("Received trackingNumber:", trackingNumber);
        console.log("Received shippingCompany:", shippingCompany);

        if (!orderId || !trackingNumber) {
            return res.status(400).json({ error: "orderId and trackingNumber are required" });
        }

        // ตรวจสอบ OrderDetail
        let orderDetail = await prisma.orderDetail.findUnique({
            where: { orderId: parseInt(orderId, 10) },
        });

        if (!orderDetail) {
            // ถ้าไม่พบ OrderDetail ให้สร้างใหม่
            orderDetail = await prisma.orderDetail.create({
                data: {
                    orderId: parseInt(orderId, 10),
                    trackingNumber,
                    shippingCompany,
                },
            });
        } else {
            // ถ้ามี OrderDetail แล้ว อัปเดตข้อมูล
            orderDetail = await prisma.orderDetail.update({
                where: { orderId: parseInt(orderId, 10) },
                data: { trackingNumber, shippingCompany },
            });
        }

        res.json({ message: "Tracking number updated successfully", orderDetail });
    } catch (error) {
        console.error("Update Tracking Number Error:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};


// ดึงข้อมูลสถิติของ Admin
exports.getAdminStats = async (req, res) => {
    try {
      const totalOrders = await prisma.order.count();
      const totalUsers = await prisma.user.count();
      const totalProducts = await prisma.product.count();
      
      const totalSales = await prisma.order.aggregate({
        _sum: { cartTotal: true }
      });
  
      console.log({
        totalOrders,
        totalUsers,
        totalProducts,
        totalSales: totalSales._sum.cartTotal || 0
      });
  
      res.json({
        totalOrders,
        totalUsers,
        totalProducts,
        totalSales: totalSales._sum.cartTotal || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error); // log ข้อผิดพลาดที่เกิดขึ้น
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
  };
  
  