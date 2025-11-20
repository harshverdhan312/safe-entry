const { Router } = require("express");
const {
    createQr,
    viewMyVisitors
} = require("../controllers/regularUser.controllers.js");

const router = Router();

// In a real app, these routes would be protected
router.route("/create-qr").post(createQr);
router.route("/visitors/:userId").get(viewMyVisitors);

module.exports = router;