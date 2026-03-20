const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const registerAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    console.log("REGISTER BODY:", req.body);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const username = trimmedEmail.split("@")[0];

    const existingAdmin = await Admin.findOne({
      $or: [{ email: trimmedEmail }, { username }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email: trimmedEmail,
      username,
      phone: trimmedPhone,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        username: admin.username,
        phone: admin.phone,
      },
    });
  } catch (error) {
    console.log("Register error full:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// LOGIN
const loginAdmin = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);
    console.log("JWT_SECRET in login:", process.env.JWT_SECRET);

    const { identifier, email, password } = req.body;
    const loginValue = (identifier || email || "").trim().toLowerCase();

    if (!loginValue || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Username and password are required",
      });
    }

    const admin = await Admin.findOne({
      $or: [{ email: loginValue }, { username: loginValue }],
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    console.log("ADMIN FOUND:", admin.email);

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing in environment variables",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        username: admin.username,
        phone: admin.phone,
      },
    });
  } catch (error) {
    console.log("Login error full:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};