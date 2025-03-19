const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getProducts = async (req, res) => {
  const { kategori } = req.query;
  try {
    let products;
    if (kategori) {
      products = await prisma.product.findMany({
        where: { nama: { contains: kategori, mode: "insensitive" } },
      });
    } else {
      products = await prisma.product.findMany();
    }
    res.json({ status: "success", data: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)
      return res
        .status(404)
        .json({ status: "error", message: "Produk tidak ditemukan." });
    res.json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { getProducts, getProductById };
