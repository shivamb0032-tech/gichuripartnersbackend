const ConsultForm = require("../models/ConsultForm");
const { Resend } = require("resend");
const generateFormEmailTemplate = require("../utils/emailTemplate");

const resend = new Resend(process.env.RESEND_API_KEY);

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

    res.status(201).json({
      success: true,
      message: "Consult form submitted successfully",
      data: savedConsult,
    });

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

    resend.emails
      .send({
        from: "Gichuri Partners <onboarding@resend.dev>",
        to: [process.env.EMAIL_USER],
        replyTo: email,
        subject: `New Consult Inquiry | ${name}`,
        html,
      })
      .then((data) => {
        console.log("Consult email sent:", data);
      })
      .catch((err) => {
        console.error("Consult email error:", err);
      });
  } catch (error) {
    console.error("Consult Form Error:", error);

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
    console.error("Get consult error:", error);

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
    console.error("Delete consult error:", error);

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