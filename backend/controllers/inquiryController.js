const Inquiry = require('../models/Inquiry');
const { seedInquiries } = require('../data/seedData');

// Valid statuses (must match Inquiry model enum)
const VALID_STATUSES = ['New', 'In Review', 'Responded'];

// @desc    Submit a contact inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res, next) => {
  try {
    const { name, phone, email, businessName, businessType, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide name and phone number' });
    }

    const inquiry = await Inquiry.create({
      name,
      phone,
      email: email || '',
      businessName: businessName || '',
      businessType: businessType || 'General Wholesale',
      message: message || ''
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been submitted.',
      inquiry: {
        id: inquiry._id,
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email,
        businessName: inquiry.businessName,
        message: inquiry.message,
        date: inquiry.date,
        status: inquiry.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/inquiries
// @access  Public (or Admin protected)
const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: inquiries.length,
      inquiries: inquiries.map(inq => ({
        id: inq._id,
        name: inq.name,
        phone: inq.phone,
        email: inq.email,
        businessName: inq.businessName,
        businessType: inq.businessType,
        message: inq.message,
        date: inq.date,
        status: inq.status
      }))
    });
  } catch (error) {
    next(error);

    
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id
// @access  Admin
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({
      success: true,
      message: 'Inquiry status updated',
      inquiry: {
        id: inquiry._id,
        name: inquiry.name,
        status: inquiry.status
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  updateInquiryStatus
};
