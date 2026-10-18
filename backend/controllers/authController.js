const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOtpEmail = require("../utils/sendEmail"); // ADDED: Email utility import

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "abch_super_secure_jwt_secret_key_2026",
    {
      expiresIn: "30d",
    },
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, businessName, location } = req.body;

    if (!name || !phone || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide all required fields",
        });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User with this email already exists",
        });
    }

    const user = await User.create({
      name,
      phone,
      email,
      password,
      businessName: businessName || "",
      location: location || "Tamil Nadu, India",
      role: "customer",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user / Authenticate
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide email/phone and password",
        });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
    }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        phone: u.phone,
        email: u.email,
        businessName: u.businessName,
        location: u.location,
        role: u.role,
        status: u.status,
        registeredDate: u.createdAt
          ? u.createdAt.toISOString().split("T")[0]
          : "2026-10-01",
      })),
    });
  } catch (error) {
    next(error);
  }
};

// In-memory OTP storage for registration (or can be in DB)
// Map: email -> { otp, userData, expiresAt }
const signupOtpStore = new Map();

// Helper to create random 6-digit OTP
const generate6DigitOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Generate OTP for new registration (checks if user already exists)
// @route   POST /api/auth/generate-signup-otp
// @access  Public
const generateSignupOtp = async (req, res, next) => {
  try {
    const { name, phone, email, password, businessName, location } = req.body;

    if (!name || !phone || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide all required fields",
        });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "An account with this email already exists",
        });
    }

    const otp = generate6DigitOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    signupOtpStore.set(cleanEmail, {
      otp,
      userData: {
        name: name.trim(),
        phone: phone.trim(),
        email: cleanEmail,
        password,
        businessName,
        location,
      },
      expiresAt,
    });

    console.log(`🔐 [AUTH OTP] Registration OTP for ${cleanEmail}: ${otp}`);

    // Send verification email via Resend
    try {
      await sendOtpEmail(cleanEmail, otp);
    } catch (emailError) {
      console.error("Email Delivery Error:", emailError.message || emailError);
      return res
        .status(500)
        .json({
          success: false,
          message:
            emailError.message || "Failed to send OTP email. Please verify your email configuration.",
        });
    }

    res.json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}. (Valid for 10 minutes)`,
      email: cleanEmail,
      // REMOVED: otp property so it does not leak to the frontend
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-signup-otp
// @access  Public
const verifySignupOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and OTP" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = signupOtpStore.get(cleanEmail);

    if (!record) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "No pending OTP verification found. Please generate a new OTP.",
        });
    }

    if (Date.now() > record.expiresAt) {
      signupOtpStore.delete(cleanEmail);
      return res
        .status(400)
        .json({
          success: false,
          message: "OTP has expired. Please request a new one.",
        });
    }

    if (String(record.otp).trim() !== String(otp).trim()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid OTP code. Please check and try again.",
        });
    }

    // OTP is valid! Create real user in DB
    const { name, phone, password, businessName, location } = record.userData;

    // Double check if already registered in meantime
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      signupOtpStore.delete(cleanEmail);
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      phone,
      email: cleanEmail,
      password,
      businessName: businessName || "",
      location: location || "Tamil Nadu, India",
      role: "customer",
      isVerified: true,
    });

    signupOtpStore.delete(cleanEmail);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account verified and created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        role: user.role,
        isVerified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request Password Reset OTP
// @route   POST /api/auth/forgot-password-otp
// @access  Public
const forgotPasswordOtp = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please enter your registered email or phone",
        });
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanInput }, { phone: emailOrPhone.trim() }],
    });

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No account registered with this email or phone number",
        });
    }

    const otp = generate6DigitOtp();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    console.log(`🔑 [AUTH OTP] Password Reset OTP for ${user.email}: ${otp}`);

    // Send password reset email via Resend
    try {
      await sendOtpEmail(user.email, otp);
    } catch (emailError) {
      console.error("Email Delivery Error:", emailError.message || emailError);
      return res
        .status(500)
        .json({
          success: false,
          message:
            emailError.message || "Failed to send password reset email. Please try again later.",
        });
    }

    res.json({
      success: true,
      message: `Password reset OTP generated and sent to ${user.email}.`,
      email: user.email,
      // REMOVED: otp property so it does not leak to the frontend
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using verified OTP
// @route   POST /api/auth/reset-password-otp
// @access  Public
const resetPasswordOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide email, OTP and new password",
        });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 6 characters",
        });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).select(
      "+resetOtp +resetOtpExpires",
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "No active password reset request found. Please request a new OTP.",
        });
    }

    if (new Date() > user.resetOtpExpires) {
      user.resetOtp = null;
      user.resetOtpExpires = null;
      await user.save();
      return res
        .status(400)
        .json({
          success: false,
          message: "Reset OTP has expired. Please request a new one.",
        });
    }

    if (String(user.resetOtp).trim() !== String(otp).trim()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid OTP code. Please check and try again.",
        });
    }

    // Set new password
    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({
      success: true,
      message: "Password has been reset successfully! You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getAllUsers,
  generateSignupOtp,
  verifySignupOtp,
  forgotPasswordOtp,
  resetPasswordOtp,
};
