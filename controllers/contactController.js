const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

const submitContactForm = async (req, res) => {
  try {
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

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Message | ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.7; color: #222;">
          <h2 style="margin-bottom: 16px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${services}</p>
          <p><strong>Company Name:</strong> ${companyName}</p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("❌ Contact form error:", error);

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