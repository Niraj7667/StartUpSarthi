const express = require('express');
const analysisController = require('../controllers/analysisController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Guest-friendly routes (can be used with or without authentication)
router.post('/analyze', optionalAuth, analysisController.analyzeIdea.bind(analysisController));
router.get('/search/:searchId', optionalAuth, analysisController.getSearchById.bind(analysisController));

// Protected routes (require authentication)
router.get('/history', requireAuth, analysisController.getSearchHistory.bind(analysisController));
router.delete('/search/:searchId', requireAuth, analysisController.deleteSearch.bind(analysisController));
router.get('/dashboard/stats', requireAuth, analysisController.getDashboardStats.bind(analysisController));

module.exports = router;