const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      match: [
        /^\+?[0-9\s\-()]{8,20}$/,
        "Please enter a valid phone number",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address",
      ],
    },

    services: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },

    companyName: {
      type: String,
      required: [true, "Company Name is required"],
      trim: true,
      maxlength: [200, "Company Name is too long"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);