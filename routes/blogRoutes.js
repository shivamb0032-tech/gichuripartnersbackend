const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getBlogs);
router.get("/:slug", getSingleBlog);

// Admin routes
router.post("/", protect, upload.single("image"), createBlog);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;