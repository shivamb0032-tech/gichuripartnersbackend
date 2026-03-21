const ConsultForm = require("../models/ConsultForm");
const nodemailer = require("nodemailer");
const generateFormEmailTemplate = require("../utils/emailTemplate");

const submitConsultForm = async (req, res) => {
  try {
    const { name, email, phone, services } = req.body;

    if (!name || !email || !phone || !services) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and services are required",
      });
    }

    const savedConsult = await ConsultForm.create({
      name,
      email,
      phone,
      services,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = generateFormEmailTemplate({
      formType: "Consult Form Submission",
      name,
      email,
      phone,
      services,
      brandName: "Gichuri Partners", // ✅ sirf brand ke liye
      logoUrl:
        "https://gichuripartners-ten.vercel.app/assets/logos/Gichuri-Partners-logo-version-3.png",
    });

    await transporter.sendMail({
      from: `"Gichuri Partners" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Consult Inquiry | ${name}`,
      html,
    });

    res.status(201).json({
      success: true,
      message: "Consult form submitted successfully",
      data: savedConsult,
    });
  } catch (error) {
    console.error("Consult Form Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getAllConsultForms = async (req, res) => {
  try {
    const consults = await ConsultForm.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consults.length,
      consults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch consult forms",
    });
  }
};

const deleteConsultForm = async (req, res) => {
  try {
    const consult = await ConsultForm.findById(req.params.id);

    if (!consult) {
      return res.status(404).json({
        success: false,
        message: "Consult form not found",
      });
    }

    await consult.deleteOne();

    res.status(200).json({
      success: true,
      message: "Consult form deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete consult form",
    });
  }
};

module.exports = {
  submitConsultForm,
  getAllConsultForms,
  deleteConsultForm,
};