const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔍 Better debug logs
if (process.env.NODE_ENV !== "production") {
  transporter.verify((error, success) => {
    if (error) {
      console.log("❌ Mailer Error:", error.message);
    } else {
      console.log("✅ Mailer Ready");
    }
  });
}


console.log("📧 EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

module.exports = transporter;