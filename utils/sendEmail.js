const transporter = require("./mailer");

const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Gichuri Partners" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.EMAIL_USER,
    });

    console.log("✅ Mail sent:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw error;
  }
};

module.exports = sendEmail;