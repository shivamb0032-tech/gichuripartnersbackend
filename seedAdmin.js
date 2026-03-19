const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash("12345678", 10);

  await Admin.create({
    email: "admin@example.com",
    password: hashedPassword,
  });

  console.log("Admin created");
  process.exit();
});