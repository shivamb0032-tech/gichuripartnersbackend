const express = require("express");
const router = express.Router();

const {
  submitConsultForm,
  getAllConsultForms,
  deleteConsultForm,
} = require("../controllers/consultController");

const { protect } = require("../middleware/authMiddleware");

// Public route
router.post("/", submitConsultForm);

// Admin routes
router.get("/", protect, getAllConsultForms);
router.delete("/:id", protect, deleteConsultForm);

module.exports = router;