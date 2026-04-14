const mongoose = require("mongoose");

const newMediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

   
    category: {
      type: String,
      required: true,
      enum: ["Company News", "Press Release"],
    },

    author: {
      type: String,
      default: "Admin",
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewMedia", newMediaSchema);