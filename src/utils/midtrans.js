const midtransClient = require("midtrans-client");
const { MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY } = require("../utils/config");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

const core = new midtransClient.CoreApi();
core.apiConfig.isProduction = false;
core.apiConfig.serverKey = MIDTRANS_SERVER_KEY;

module.exports = { snap, core };
