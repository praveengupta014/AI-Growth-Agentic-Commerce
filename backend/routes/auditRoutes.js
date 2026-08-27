const express = require('express');
const router = express.Router();
const { getAudits, getDashboardStats } = require('../controllers/auditController');

router.get('/', getAudits);
router.get('/stats', getDashboardStats);

module.exports = router;
