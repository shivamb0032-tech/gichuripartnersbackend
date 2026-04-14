const NewMedia = require("../models/NewMedia");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ✅ Slug Generator
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// ✅ Upload Image
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "newmedia", // 👈 folder change
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ✅ CREATE
const createNewMedia = async (req, res) => {
  try {
    const { title, excerpt, content, category, author, published } = req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt, content & category are required",
      });
    }

    let slug = generateSlug(title);

    const existing = await NewMedia.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    let image = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      image = uploaded.secure_url;
    }

    const newMedia = await NewMedia.create({
      title,
      slug,
      excerpt,
      content,
      image,
      category, // 👈 important (Company News / Press Release)
      author: author || "Admin",
      published:
        published !== undefined
          ? published === "true" || published === true
          : true,
    });

    res.status(201).json({
      success: true,
      data: newMedia,
    });
  } catch (error) {
    console.error("CREATE NEWMEDIA ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL
const getNewMedia = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    // 👉 category filter support (important for frontend tabs)
    if (category) {
      filter.category = category;
    }

    const data = await NewMedia.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET NEWMEDIA ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET SINGLE
const getSingleNewMedia = async (req, res) => {
  try {
    const item = await NewMedia.findOne({ slug: req.params.slug });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("GET SINGLE NEWMEDIA ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE
const updateNewMedia = async (req, res) => {
  try {
    const { title, excerpt, content, category, author, published } = req.body;

    const item = await NewMedia.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    let updatedSlug = item.slug;

    if (title && title !== item.title) {
      let slug = generateSlug(title);

      const existing = await NewMedia.findOne({
        slug,
        _id: { $ne: req.params.id },
      });

      if (existing) slug = `${slug}-${Date.now()}`;

      updatedSlug = slug;
    }

    let updatedImage = item.image;

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      updatedImage = uploaded.secure_url;
    }

    item.title = title || item.title;
    item.slug = updatedSlug;
    item.excerpt = excerpt || item.excerpt;
    item.content = content || item.content;
    item.image = updatedImage;
    item.category = category || item.category;
    item.author = author || item.author;
    item.published =
      published !== undefined
        ? published === "true" || published === true
        : item.published;

    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("UPDATE NEWMEDIA ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE
const deleteNewMedia = async (req, res) => {
  try {
    const item = await NewMedia.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    await NewMedia.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NEWMEDIA ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewMedia,
  getNewMedia,
  getSingleNewMedia,
  updateNewMedia,
  deleteNewMedia,
};