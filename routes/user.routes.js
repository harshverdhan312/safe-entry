const { Router } = require("express");
const {
    loginUser,
    registerAdmin,
    changePassword,
    updateUserDetails
} = require("../controllers/user.controllers.js");

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginUser);

// In a real app, this would be a protected route
router.route("/change-password").post(changePassword);
router.route("/update-details").post(updateUserDetails);

module.exports = router;