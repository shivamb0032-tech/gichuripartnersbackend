const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://gichuripartners-ten.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});