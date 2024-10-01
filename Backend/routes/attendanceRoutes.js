const express = require('express');
const router = express.Router();
const {saveReport} = require('../controllers/attendanceController');
const attendanceController = require('../controllers/attendanceController');

// Route to handle student login
router.post('/login', attendanceController.login);

// Route to handle student logout
router.post('/logout', attendanceController.logout);

// Route to generate the attendance report
router.get('/report', attendanceController.generateReport);

// Route to save the final report
router.post('/saveReport', attendanceController.saveReport);

module.exports = router;
