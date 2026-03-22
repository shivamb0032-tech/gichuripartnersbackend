const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // 465 nahi, 587 use karenge
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  tls: {
    servername: "smtp.gmail.com",
  },
});

console.log("📧 EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

module.exports = transporter;