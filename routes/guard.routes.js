const { Router } = require("express");
const { scanQrCode } = require("../controllers/guard.controllers.js");

const router = Router();

// In a real app, this would be a protected route accessible only by guards
router.route("/scan-qr").post(scanQrCode);

module.exports = router;