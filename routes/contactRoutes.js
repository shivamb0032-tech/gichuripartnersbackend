const express = require("express");
const router = express.Router();

const {
  submitContactForm,
  getAllContactForms,
  deleteContactForm,
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");

// Public route
router.post("/", submitContactForm);

// Admin routes
router.get("/", protect, getAllContactForms);
router.delete("/:id", protect, deleteContactForm);

module.exports = router;