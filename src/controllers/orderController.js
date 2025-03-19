const { PrismaClient } = require("@prisma/client");
const { snap } = require("../utils/midtrans");
const authenticateToken = require("../middlewares/authMiddleware");

const prisma = new PrismaClient();

const createOrder = authenticateToken(async (req, res) => {
  const { product_id, jumlah, metode_pembayaran, detail_pembayaran } = req.body;
  try {
    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });
    if (!product)
      return res
        .status(404)
        .json({ status: "error", message: "Produk tidak ditemukan." });

    const total_harga = product.harga * jumlah;
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        productId: product_id,
        jumlah,
        total_harga,
        metode_pembayaran,
        detail_pembayaran: JSON.stringify(detail_pembayaran),
      },
    });

    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: total_harga,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: req.user.nama_lengkap,
        email: req.user.email,
        phone: req.user.nomor_hp,
      },
    };

    const midtransResponse = await snap.createTransaction(parameter);
    res.json({
      status: "success",
      message: "Transaksi berhasil dibuat.",
      data: {
        order_id: order.id,
        total_harga,
        status: order.status,
        payment_url: midtransResponse.redirect_url,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

const getUserOrders = authenticateToken(async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        product: true,
      },
    });
    res.json({ status: "success", data: orders });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = { createOrder, getUserOrders };
