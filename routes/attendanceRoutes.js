const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/AuthMiddleware');

router.post('/check-in', auth(), attendanceController.checkIn);
router.post('/check-out', auth(), attendanceController.checkOut);
router.get('/', auth(), attendanceController.getAttendance);

module.exports = router;
