require("dotenv").config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || "";

module.exports = {
  PORT,
  JWT_SECRET,
  MIDTRANS_SERVER_KEY,
  MIDTRANS_CLIENT_KEY,
};
