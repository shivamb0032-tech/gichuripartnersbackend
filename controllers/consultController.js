const ConsultForm = require("../models/ConsultForm");
const sendEmail = require("../utils/sendEmail");
const generateFormEmailTemplate = require("../utils/emailTemplate");

const submitConsultForm = async (req, res) => {
  try {
    console.log("📩 Consult req.body:", req.body);
    console.log("📧 EMAIL_USER exists:", !!process.env.EMAIL_USER);
    console.log("🔑 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

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

    console.log("✅ Consult saved in DB:", savedConsult._id);

    const html = generateFormEmailTemplate({
      formType: "Consult Form Submission",
      name,
      email,
      phone,
      services,
      brandName: "Gichuri Partners",
      logoUrl:
        "https://gichuripartners-ten.vercel.app/assets/logos/Gichuri-Partners-logo-version-3.png",
    });

    console.log("✅ Email template generated");

    const mailInfo = await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New Consult Inquiry | ${name}`,
      replyTo: email,
      html,
    });

    console.log("✅ Mail sent:", mailInfo.response);

    return res.status(201).json({
      success: true,
      message: "Consult form submitted successfully",
      data: savedConsult,
    });
  } catch (error) {
    console.error("❌ Consult Form Error Full:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getAllConsultForms = async (req, res) => {
  try {
    const consults = await ConsultForm.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: consults.length,
      consults,
    });
  } catch (error) {
    console.error("❌ Get consult error:", error);

    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: "Consult form deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete consult error:", error);

    return res.status(500).json({
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