const Invoice = require('../models/Invoice');
const { seedInvoices } = require('../data/seedData');

// @desc    Generate a new invoice
// @route   POST /api/invoices
// @access  Public (or Admin protected)
const createInvoice = async (req, res, next) => {
  try {
    const {
      invoiceNumber,
      date,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      subtotal,
      taxRate,
      taxAmount,
      shipping,
      grandTotal,
      status
    } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide customer name and invoice items' });
    }

    const invNum = invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const invoice = await Invoice.create({
      invoiceNumber: invNum,
      date: date || new Date().toISOString().split('T')[0],
      customerName,
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || '',
      customerAddress: customerAddress || '',
      items,
      subtotal: Number(subtotal) || 0,
      taxRate: Number(taxRate) || 5,
      taxAmount: Number(taxAmount) || 0,
      shipping: Number(shipping) || 0,
      grandTotal: Number(grandTotal) || 0,
      status: status || 'Paid'
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully in MongoDB',
      invoice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices with optional search & date filter
// @route   GET /api/invoices
// @access  Public (or Admin protected)
const getInvoices = async (req, res, next) => {
  try {
    const { search, date } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    if (date) {
      query.date = date;
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: invoices.length,
      invoices: invoices.map(inv => ({
        id: inv._id,
        invoiceNumber: inv.invoiceNumber,
        date: inv.date,
        customerName: inv.customerName,
        customerPhone: inv.customerPhone,
        customerEmail: inv.customerEmail,
        customerAddress: inv.customerAddress,
        items: inv.items,
        subtotal: inv.subtotal,
        taxRate: inv.taxRate,
        taxAmount: inv.taxAmount,
        shipping: inv.shipping,
        grandTotal: inv.grandTotal,
        status: inv.status
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Public (or Admin protected)
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById
};
