const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// POST route for student login
router.post('/login', async (req, res) => {
  const { rollNumber, courseID, systemId, location, verificationStatus } = req.body;
  
  if (!rollNumber || !courseID || !systemId || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {

    // Create a new login record in the Student collection
    const newLogin = new Student({
      rollNumber,
      courseID,
      location,
      systemId,
      status: 'login',
      verificationStatus: verificationStatus || false,
      loginTime: new Date()
    });

    await newLogin.save();
    console.log('Student login recorded successfully');
    return res.status(201).json({ message: 'Student login recorded successfully' });
  } catch (error) {
    console.error('Error saving login data:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Error saving login data', error: error.message });
  }
});

// POST route for student logout
router.post('/logout', async (req, res) => {
  const { rollNumber, courseID, systemId, location, verificationStatus } = req.body;

  if (!rollNumber || !courseID || !systemId || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {

    // Create a new logout record in the Student collection
    const newLogout = new Student({
      rollNumber,
      courseID: req.body.courseID,
      location,
      systemId,
      status: 'logout',
      verificationStatus: verificationStatus || false,
      logoutTime: new Date()
    });

    await newLogout.save();
    console.log('Student logout recorded successfully');
    // Find the matching login record to merge login and logout data
    const loginRecord = await Student.findOne({ rollNumber, courseID,systemId, status: 'login' });

    if (!loginRecord) {
      return res.status(400).json({ message: 'No corresponding login record found' });
    }

    // Create an Attendance record by merging login and logout details
    const newAttendance = new Attendance({
      attendanceId: new mongoose.Types.ObjectId().toString(),
      rollNumber: loginRecord.rollNumber,
      systemId: systemId,
      loginTime: loginRecord.loginTime,
      logoutTime: newLogout.logoutTime,
      courseID: loginRecord.courseID,
      verificationStatus: newLogout.verificationStatus,
      qrCodeValid: true, // Assuming QR code is valid
      locationValid: newLogout.verificationStatus // Assuming location is verified at logout
    });

    await newAttendance.save();
    console.log('Student attendance recorded successfully');
    return res.status(201).json({ message: 'Student logout recorded and attendance saved successfully' });
  } catch (error) {
    console.error('Error saving logout data:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Error saving logout data', error: error.message });
  }
});

module.exports = router;
