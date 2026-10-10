const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries, updateInquiryStatus } = require('../controllers/inquiryController');

router.post('/', createInquiry);
router.get('/', getInquiries);
router.patch('/:id', updateInquiryStatus);

module.exports = router;
