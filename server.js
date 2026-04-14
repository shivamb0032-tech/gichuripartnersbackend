const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://gichuripartners-ten.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ❌ ye line mat lagana
// app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("📧 EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("🛢️ MONGO_URI exists:", !!process.env.MONGO_URI);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/newmedia", require("./routes/newsRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/consult", require("./routes/consultRoutes"));

// Static files
app.use("/uploads", express.static("public/uploads"));

// Health check
app.get("/", (req, res) => {
  res.status(200).send("API running...");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Global Server Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();