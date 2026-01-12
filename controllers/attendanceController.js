const Attendance = require('../models/Attendance');
const { getDistance } = require('geolib');
const { Op } = require('sequelize');

// Target coordinates for new location
const TARGET_LOCATION = { latitude: 28.4362352, longitude: 77.0513863 };
const MAX_DISTANCE_METERS = 100;

exports.checkIn = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const userId = req.user.userId;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Location coordinates required' });
        }

        const distance = getDistance(
            { latitude, longitude },
            TARGET_LOCATION
        );

        if (distance > MAX_DISTANCE_METERS) {
            return res.status(400).json({
                error: 'Why are you checking in from the moon? You are too far from the office.',
                distance: `${distance} meters`
            });
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // 9:00 AM (9) to 10:30 AM (10 and 30)
        // Check if before 9:00 AM
        if (currentHour < 9) {
            return res.status(400).json({ error: 'Office starts at 9:00 AM. Please wait.' });
        }

        // Check if after 10:30 AM
        // Note: 10:30 is the cutoff to complete 9 hours by 7:30 PM (19:30)
        if (currentHour > 10 || (currentHour === 10 && currentMinute > 30)) {
            return res.status(400).json({ error: 'You are late! Check-in allowed only until 10:30 AM to complete 9 hours.' });
        }

        // Check if already checked in today
        const today = new Date().toISOString().split('T')[0];
        const existingAttendance = await Attendance.findOne({
            where: {
                userId,
                date: today
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ error: 'Already checked in for today' });
        }

        const attendance = await Attendance.create({
            userId,
            date: today,
            checkInTime: new Date(),
            status: 'PRESENT',
            location: { latitude, longitude }
        });

        res.status(201).json({ message: 'Check-in successful', attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkOut = async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({
            where: {
                userId,
                date: today
            }
        });

        if (!attendance) {
            return res.status(404).json({ error: 'No check-in record found for today' });
        }

        if (attendance.checkOutTime) {
            return res.status(400).json({ error: 'Already checked out' });
        }

        const checkOutTime = new Date();
        attendance.checkOutTime = checkOutTime;

        // Calculate hours worked
        const checkInTime = new Date(attendance.checkInTime);
        const durationMs = checkOutTime - checkInTime;
        const durationHours = durationMs / (1000 * 60 * 60);

        // Update status based on 9 hours rule
        if (durationHours >= 9) {
            attendance.status = 'PRESENT';
        } else {
            attendance.status = 'HALF_DAY';
        }

        await attendance.save();

        res.json({
            message: 'Check-out successful',
            attendance,
            duration: `${durationHours.toFixed(2)} hours`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const { role, userId } = req.user;
        let whereClause = {};

        if (role === 'EMPLOYEE') {
            whereClause.userId = userId;
        } else if ((role === 'HR' || role === 'ADMIN') && req.query.userId) {
            // Allow filtering by specific user for HR/Admin
            whereClause.userId = req.query.userId;
        }
        // HR/Admin can see all if no userId matches, so no extra whereClause needed otherwise

        const attendance = await Attendance.findAll({
            where: whereClause,
            include: [{
                model: require('../models/User'),
                attributes: ['name', 'phone']
            }],
            order: [['date', 'DESC'], ['checkInTime', 'DESC']]
        });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
