const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile);
router.get('/users', getAllUsers);

module.exports = router;
