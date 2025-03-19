const { PrismaClient } = require("@prisma/client");
const { core } = require("../utils/midtrans");

const prisma = new PrismaClient();

const verifyPayment = async (req, res) => {
  const { order_id, bukti_transfer } = req.body;
  try {
    const order = await prisma.order.findUnique({ where: { id: order_id } });
    if (!order)
      return res
        .status(404)
        .json({ status: "error", message: "Transaksi tidak ditemukan." });

    await prisma.order.update({
      where: { id: order_id },
      data: {
        detail_pembayaran: {
          ...JSON.parse(order.detail_pembayaran),
          bukti_transfer,
        },
      },
    });

    const response = await core.transaction.status(order_id);
    if (
      response.transaction_status === "capture" ||
      response.transaction_status === "settlement"
    ) {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: "diterima" },
      });

      const product = await prisma.product.findUnique({
        where: { id: order.productId },
      });
      const expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + product.durasi_hari);

      const account = await prisma.account.create({
        data: {
          productId: product.id,
          username: `user_${product.nama
            .toLowerCase()
            .replace(/\s+/g, "_")}${Math.floor(Math.random() * 1000)}`,
          password: `pass_${Math.floor(Math.random() * 100000)}`,
          expired_at: expiredAt,
          orderId: order_id,
          userId: order.userId,
        },
      });

      res.json({
        status: "success",
        message: "Pembayaran berhasil diverifikasi.",
        data: account,
      });
    } else {
      res.json({
        status: "error",
        message: "Pembayaran belum berhasil diproses.",
      });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { verifyPayment };
