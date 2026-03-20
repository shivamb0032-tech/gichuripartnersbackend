const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blogs",
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

const createBlog = async (req, res) => {
  try {
    console.log("REQ BODY =>", req.body);
    console.log("REQ FILE =>", req.file);

    const { title, excerpt, content, category, author, published } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt and content are required",
      });
    }

    let slug = generateSlug(title);

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    let image = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      image = uploadedImage.secure_url;
    }

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      image,
      category: category || "",
      author: author || "Admin",
      published:
        published !== undefined
          ? published === "true" || published === true
          : true,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("CREATE BLOG ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("GET BLOGS ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("GET SINGLE BLOG ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    console.log("UPDATE BODY =>", req.body);
    console.log("UPDATE FILE =>", req.file);

    const { title, excerpt, content, category, author, published } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    let updatedSlug = blog.slug;

    if (title && title !== blog.title) {
      let slug = generateSlug(title);

      const existingBlog = await Blog.findOne({
        slug,
        _id: { $ne: req.params.id },
      });

      if (existingBlog) {
        slug = `${slug}-${Date.now()}`;
      }

      updatedSlug = slug;
    }

    let updatedImage = blog.image;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      updatedImage = uploadedImage.secure_url;
    }

    blog.title = title || blog.title;
    blog.slug = updatedSlug;
    blog.excerpt = excerpt || blog.excerpt;
    blog.content = content || blog.content;
    blog.image = updatedImage;
    blog.category = category || blog.category;
    blog.author = author || blog.author;
    blog.published =
      published !== undefined
        ? published === "true" || published === true
        : blog.published;

    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("UPDATE BLOG ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BLOG ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};