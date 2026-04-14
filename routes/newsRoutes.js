const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createNewMedia,
  getNewMedia,
  getSingleNewMedia,
  updateNewMedia,
  deleteNewMedia,
} = require("../controllers/newMediaController");

const { protect } = require("../middleware/authMiddleware");

// ✅ Public Routes
router.get("/", getNewMedia);
router.get("/:slug", getSingleNewMedia);

// ✅ Admin Routes
router.post("/", protect, upload.single("image"), createNewMedia);
router.put("/:id", protect, upload.single("image"), updateNewMedia);
router.delete("/:id", protect, deleteNewMedia);

module.exports = router;