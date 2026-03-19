const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

console.log("authController =>", authController);

router.post("/register", authController.registerAdmin);
router.post("/login", authController.loginAdmin);

module.exports = router;