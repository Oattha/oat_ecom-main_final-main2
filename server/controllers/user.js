const prisma = require("../config/prisma");

exports.listUsers = async (req, res) => {
  try {
    //code
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        address: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.changeStatus = async (req, res) => {
  try {
    //code
    const { id, enabled } = req.body;
    console.log(id, enabled);
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { enabled: enabled },
    });

    res.send("Update Status Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.changeRole = async (req, res) => {
  try {
    //code
    const { id, role } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role: role },
    });

    res.send("Update Role Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.userCart = async (req, res) => {
  try {
    //code
    const { cart } = req.body;
    console.log(cart);
    console.log(req.user.id);

    const user = await prisma.user.findFirst({
      where: { id: Number(req.user.id) },
    });
    // console.log(user)

    // Check quantity
    for (const item of cart) {
      // console.log(item)
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { quantity: true, title: true },
      });
      // console.log(item)
      // console.log(product)
      if (!product || item.count > product.quantity) {
        return res.status(400).json({
          ok: false,
          message: `ขออภัย. สินค้า ${product?.title || "product"} หมด`,
        });
      }
    }

    // Deleted old Cart item
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user.id,
        },
      },
    });
    // Deeted old Cart
    await prisma.cart.deleteMany({
      where: { orderedById: user.id },
    });

    // เตรียมสินค้า
    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    // หาผลรวม
    let cartTotal = products.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    // New cart
    const newCart = await prisma.cart.create({
      data: {
        products: {
          create: products,
        },
        cartTotal: cartTotal,
        orderedById: user.id,
      },
    });
    console.log(newCart);
    res.send("Add Cart Ok");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getUserCart = async (req, res) => {
  try {
    //code
    // req.user.id
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    console.log(cart);
    res.json({
      products: cart.products,
      cartTotal: cart.cartTotal,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.emptyCart = async (req, res) => {
  try {
    //code
    const cart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
    });
    if (!cart) {
      return res.status(400).json({ message: "No cart" });
    }
    await prisma.productOnCart.deleteMany({
      where: { cartId: cart.id },
    });
    const result = await prisma.cart.deleteMany({
      where: { orderedById: Number(req.user.id) },
    });

    console.log(result);
    res.json({
      message: "Cart Empty Success",
      deletedCount: result.count,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.saveAddress = async (req, res) => {
  try {
    //code
    const { address } = req.body;
    console.log(address);
    const addresssUser = await prisma.user.update({
      where: {
        id: Number(req.user.id),
      },
      data: {
        address: address,
      },
    });

    res.json({ ok: true, message: "Address update success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.saveOrder = async (req, res) => {
  try {
    //code
    // Step 0 Check Stripe
    // console.log(req.body)
    // return res.send('hello Jukkru!!!')
    // stripePaymentId String
    // amount          Int
    // status          String
    // currentcy       String
    const { id, amount, status, currency } = req.body.paymentIntent;

    // Step 1 Get User Cart
    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: { products: true },
    });

    // Check Cart empty
    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({ ok: false, message: "Cart is Empty" });
    }

    const amountTHB = Number(amount) / 100;
    // Create a new Order
    const order = await prisma.order.create({
      data: {
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
        orderedBy: {
          connect: { id: req.user.id },
        },
        cartTotal: userCart.cartTotal,
        stripePaymentId: id,
        amount: amountTHB,
        status: status,
        currentcy: currency,
      },
    });
    // stripePaymentId String
    // amount          Int
    // status          String
    // currentcy       String

    // Update Product
    const update = userCart.products.map((item) => ({
      where: { id: item.productId },
      data: {
        quantity: { decrement: item.count },
        sold: { increment: item.count },
      },
    }));
    console.log(update);

    await Promise.all(update.map((updated) => prisma.product.update(updated)));

    await prisma.cart.deleteMany({
      where: { orderedById: Number(req.user.id) },
    });
    res.json({ ok: true, orderId: order.id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getOrder = async (req, res) => {
  try {
    //code
    const orders = await prisma.order.findMany({
      where: { orderedById: Number(req.user.id) },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    if (orders.length === 0) {
      return res.status(400).json({ ok: false, message: "No orders" });
    }

    res.json({ ok: true, orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// controllers/user.js 

exports.getNameAndPhone = async (req, res) => {
  try {
      // ค้นหาคำสั่งซื้อของผู้ใช้
      const order = await prisma.order.findFirst({
          where: { orderedById: req.user.id },
          include: {
              orderDetail: true, // ดึงข้อมูลจาก OrderDetail
          }
      });

      if (!order || !order.orderDetail) {
          return res.status(404).json({ message: "Order not found" });
      }

      // ส่งข้อมูลชื่อ, เบอร์โทร, และที่อยู่จาก OrderDetail
      res.json({
          name: order.orderDetail.name,
          phone: order.orderDetail.phone,
          address: order.orderDetail.address,
      });
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
  }
};


exports.saveNameAndPhone = async (req, res) => {
  try {
      const { name, phone, address } = req.body; // เพิ่ม address ในการรับข้อมูลจาก body

      // ค้นหาคำสั่งซื้อที่เกี่ยวข้องกับผู้ใช้
      const order = await prisma.order.findFirst({
          where: { orderedById: req.user.id },
          include: {
              orderDetail: true, // ตรวจสอบว่าเรามี OrderDetail อยู่แล้วหรือไม่
          }
      });

      if (!order || !order.orderDetail) {
          return res.status(404).json({ message: "Order not found" });
      }

      // อัปเดตข้อมูลใน OrderDetail
      const updatedOrderDetail = await prisma.orderDetail.update({
          where: { orderId: order.id }, // ใช้ orderId เพื่อค้นหา OrderDetail
          data: { name, phone, address }, // อัปเดต name, phone, address
      });

      res.json({ message: "บันทึกข้อมูลสำเร็จ", updatedOrderDetail });
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
  }
};


//ดึงข้อมูลผู้ใช้ปัจจุบัน
exports.currentUser = async (req, res) => {
  try {
      const user = await prisma.user.findFirst({
          where: { email: req.user.email },
          select: {
              id: true,
              name: true,  // ✅ ดึง name
              phone: true, // ✅ ดึง phone
              email: true,
              role: true,
              address: true // ✅ ดึง address (ที่อยู่)
          }
      });
      res.json({ user });
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server Error' });
  }
}
//แก้ไขข้อมูลผู้ใช้
exports.updateUser = async (req, res) => {
  const { name, phone, address } = req.body; // ดึงข้อมูลจาก body (ที่ส่งมาจาก client)

  try {
    const user = await prisma.user.update({
      where: { email: req.user.email }, // ค้นหาผู้ใช้ตามอีเมล
      data: {
        name, // อัปเดตชื่อ
        phone, // อัปเดตเบอร์โทร
        address, // อัปเดตที่อยู่
      },
    });

    // ส่งข้อมูลที่อัปเดตกลับไป
    res.json({ message: "ข้อมูลอัปเดตสำเร็จ", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};



exports.createOrderDetail = async (req, res) => {
  try {
    let { orderId, trackingNumber, shippingCompany, name, phone, address } = req.body;

    // ✅ ถ้าไม่ได้ส่ง orderId มา → ดึง orderId ล่าสุดจากตาราง Order
    if (!orderId) {
      const latestOrder = await prisma.order.findFirst({
        orderBy: { id: "desc" }, // ดึง order ล่าสุด
      });

      if (!latestOrder) {
        return res.status(400).json({ message: "No existing orders found" });
      }

      orderId = latestOrder.id; // ใช้ orderId ล่าสุด
    }

    // ✅ ตรวจสอบว่า orderDetail มีอยู่แล้วหรือไม่
    let existingOrderDetail = await prisma.orderDetail.findFirst({
      where: { orderId }
    });

    let result;
    if (existingOrderDetail) {
      // ✅ ถ้ามีอยู่แล้ว → อัปเดต
      result = await prisma.orderDetail.update({
        where: { id: existingOrderDetail.id },
        data: { trackingNumber, shippingCompany, name, phone, address }
      });
    } else {
      // ✅ ถ้ายังไม่มี → สร้างใหม่
      result = await prisma.orderDetail.create({
        data: { orderId, trackingNumber, shippingCompany, name, phone, address }
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error creating/updating order detail:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




//new code2
exports.getOrderDetailByOrderId = async (req, res) => {
  try {
    console.log("📌 [START] Fetching OrderDetail");

    const { orderId } = req.params;
    console.log("🔍 Received orderId:", orderId);

    // ตรวจสอบว่า orderId เป็นตัวเลขหรือไม่
    const parsedOrderId = parseInt(orderId);
    if (isNaN(parsedOrderId)) {
      console.log("❌ Invalid orderId format:", orderId);
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    // ค้นหา OrderDetail ตาม orderId
    console.log("🔎 Searching for OrderDetail with orderId:", parsedOrderId);
    const orderDetail = await prisma.orderDetail.findUnique({
      where: { orderId: parsedOrderId }
    });

    if (!orderDetail) {
      console.log("⚠️ OrderDetail not found for orderId:", parsedOrderId);
      return res.status(404).json({ message: "OrderDetail not found" });
    }

    console.log("✅ OrderDetail found:", orderDetail);
    res.status(200).json(orderDetail);

  } catch (error) {
    console.error("❌ Error fetching order detail:", error);
    res.status(500).json({ message: "Server Error" });
  }
};





// controllers/user.js


exports.getOrderTracking = async (req, res) => {
  try {
    console.log("🔍 req.user:", req.user); // ✅ ตรวจสอบ user id
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: ไม่มีข้อมูลผู้ใช้" });
    }

    const orders = await prisma.order.findMany({
      where: { orderedById: userId },
      include: { orderDetail: true },
    });

    if (!orders.length) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อของคุณ" });
    }

    const trackingInfo = orders.map(order => ({
      orderId: order.id,
      trackingNumber: order.orderDetail?.trackingNumber || "ยังไม่มีหมายเลข Tracking",
      shippingCompany: order.orderDetail?.shippingCompany || "ยังไม่มีบริษัทขนส่ง",
      address: order.orderDetail?.address || "ยังไม่มีที่อยู่",
      phone: order.orderDetail?.phone || "ยังไม่มีเบอร์โทร",
      name: order.orderDetail?.name || "ยังไม่มีชื่อผู้สั่งซื้อ"
    }));

    res.json(trackingInfo);
  } catch (err) {
    console.log("❌ Error in getOrderTracking:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
};