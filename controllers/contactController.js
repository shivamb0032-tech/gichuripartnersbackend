const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const savedMessage = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Message",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: savedMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitContactForm };