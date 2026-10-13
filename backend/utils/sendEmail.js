const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"ABCH Traders" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your ABCH Traders verification code",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e5e5;border-radius:8px">
        <h2 style="color:#14532D">ABCH Traders</h2>
        <p>Use this code to verify your email:</p>
        <p style="font-size:32px;font-weight:800;letter-spacing:8px;color:#14532D">${otp}</p>
        <p style="color:#666;font-size:13px">This code expires in 10 minutes. If you didn't request it, ignore this email.</p>
      </div>`,
  });
};

module.exports = sendOtpEmail;