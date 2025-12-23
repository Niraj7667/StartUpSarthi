const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', authController.signup.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected routes
router.post('/claim-profile', requireAuth, authController.claimProfile.bind(authController));
router.get('/profile', requireAuth, authController.getProfile.bind(authController));

module.exports = router;