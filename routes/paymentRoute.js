const express = require('express');
const { makePayment, verifyPayment, paymentHistory } = require('../controllers/paymentController');

const router = express.Router();
router.post('/makePayment', makePayment);
router.post('/verifyPayment', verifyPayment);
router.post('/paymentHistory', paymentHistory);

module.exports = router;