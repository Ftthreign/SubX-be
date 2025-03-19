const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { JWT_SECRET } = require("../utils/config");

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const { email, password, nama_lengkap, nomor_hp } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nama_lengkap,
        nomor_hp,
      },
    });
    res
      .status(201)
      .json({ status: "success", message: "Pengguna berhasil didaftarkan." });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res
        .status(400)
        .json({ status: "error", message: "Email atau password salah." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: "error", message: "Email atau password salah." });

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      status: "success",
      message: "Login berhasil.",
      data: { access_token: accessToken },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { registerUser, loginUser };
