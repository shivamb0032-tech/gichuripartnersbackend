const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");
const generateFormEmailTemplate = require("../utils/emailTemplate");

const submitContactForm = async (req, res) => {
  try {
    console.log("📩 Contact req.body:", req.body);
    console.log("📧 EMAIL_USER exists:", !!process.env.EMAIL_USER);
    console.log("🔑 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    const { name, email, phone, services, companyName } = req.body;

    if (!name || !email || !phone || !services || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, service and company name are required",
      });
    }

    const savedMessage = await Contact.create({
      name,
      email,
      phone,
      services,
      companyName,
    });

    console.log("✅ Contact saved in DB:", savedMessage._id);

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

    console.log("✅ Email template generated");

    const mailInfo = await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New Contact Inquiry | ${name}`,
      replyTo: email,
      html,
    });

    console.log("✅ Mail sent:", mailInfo.response);

    return res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("❌ Contact Form Error Full:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while submitting the form",
    });
  }
};

const getAllContactForms = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("❌ Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch contact forms",
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

    res.status(200).json({
      success: true,
      message: "Contact form deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete contact error:", error);

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