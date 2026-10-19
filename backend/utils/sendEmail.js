const { Resend } = require("resend");

// Initialize Resend client using the API key
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
};

/**
 * Sends OTP verification emails using Resend HTTP API.
 * Resend free tier includes 3,000 emails/month and up to 100 emails/day.
 * Uses HTTP requests over port 443, preventing Render free tier SMTP port blocks.
 *
 * @param {string} to - Destination email address
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (to, otp) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ [Resend] RESEND_API_KEY is not defined in environment variables.");
    throw new Error("RESEND_API_KEY is missing. Please configure your Resend API key in Render / .env.");
  }

  const resend = getResendClient();

  // Resend sender:
  // Use verified domain sender if configured (e.g. "ABCH Traders <orders@yourdomain.com>")
  // Default to Resend testing sender: "ABCH Traders <onboarding@resend.dev>"
  const fromEmail = 'ABCH Traders <no-reply@abchtraders.com>'

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: `Your ABCH Traders verification code: ${otp}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e5e5;border-radius:8px">
        <h2 style="color:#14532D;margin-top:0;">ABCH Traders</h2>
        <p style="font-size:15px;color:#333;">Use the verification code below to complete your authentication:</p>
        <div style="background-color:#F0FDF4;border:1px dashed #16A34A;border-radius:6px;padding:16px;text-align:center;margin:20px 0;">
          <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#14532D;font-family:monospace;">${otp}</span>
        </div>
        <p style="color:#666;font-size:13px;line-height:1.5;">This code expires in 10 minutes. If you did not request this verification code, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p style="color:#999;font-size:11px;text-align:center;">&copy; ABCH Traders Wholesale Platform</p>
      </div>`,
  });

  if (error) {
    console.error("❌ [Resend Delivery Error]:", error);
    throw new Error(error.message || "Failed to send email via Resend.");
  }

  console.log(`✉️ [Resend Delivery Success] Sent OTP to ${to} (Message ID: ${data?.id})`);
  return data;
};

module.exports = sendOtpEmail;