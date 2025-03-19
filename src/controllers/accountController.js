const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middlewares/authMiddleware");

const prisma = new PrismaClient();

const getUserAccounts = authenticateToken(async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { user: { id: req.user.id } },
      include: {
        product: true,
      },
    });
    res.json({ status: "success", data: accounts });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = { getUserAccounts };
