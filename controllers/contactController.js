const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");
const generateFormEmailTemplate = require("../utils/emailTemplate");

const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, services, companyName } = req.body;

    if (!name || !email || !phone || !services || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, services and company name are required",
      });
    }

    const savedMessage = await Contact.create({
      name,
      email,
      phone,
      services,
      companyName,
    });

    const html = generateFormEmailTemplate({
      formType: "Contact Form Submission",
      name,
      email,
      phone,
      services,
      companyName,
      brandName: "Gichuri Partners",
      logoUrl:
        "https://gichuripartners-ten.vercel.app/assets/logos/Gichuri-Partners-logo-version-3.png",
    });

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      await transporter.sendMail({
        from: `"Gichuri Partners" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: "New Contact Form Message",
        html,
      });
    } catch (mailError) {
      console.error("Mail send error:", mailError);
    }

    return res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getAllContactForms = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch contacts",
    });
  }
};

const deleteContactForm = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact form not found",
      });
    }

    await contact.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Contact form deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete contact form",
    });
  }
};

module.exports = {
  submitContactForm,
  getAllContactForms,
  deleteContactForm,
};