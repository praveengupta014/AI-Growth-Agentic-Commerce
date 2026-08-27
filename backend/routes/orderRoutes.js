const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/user/:userId', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;
