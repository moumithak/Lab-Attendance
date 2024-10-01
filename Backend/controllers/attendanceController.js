const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// Simulated function to verify QR code (you can replace this with actual logic)
const verifyQRCode = (qrCode, systemId) => {
  return qrCode === systemId; // No assumptions made; only verification through logic
};

// Simulated function to verify location (you can replace this with actual logic)
const verifyLocation = (location, validLocation) => {
  return location === validLocation; // No assumptions, validate the GPS coordinates
};

// Function to handle student login
exports.login = async (req, res) => {
  const { rollNumber, systemId, courseId, qrCode, location } = req.body;

  try {
    const qrCodeValid = verifyQRCode(qrCode, systemId);
    const locationValid = verifyLocation(location, 'LabLocation123');

    const verificationStatus = qrCodeValid && locationValid;

    const attendance = new Attendance({
      attendanceId: new mongoose.Types.ObjectId().toString(),
      rollNumber,
      systemId,
      courseId,
      loginTime: new Date(),
      qrCodeValid,
      locationValid,
      verificationStatus,
    });

    await attendance.save();
    return res.status(201).json({ message: 'Login successful', attendance });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error during login' });
  }
};

// Function to handle student logout
exports.logout = async (req, res) => {
  const { rollNumber, systemId, qrCode, location } = req.body;

  try {
    const attendance = await Attendance.findOne({
      rollNumber,
      systemId,
      logoutTime: null,
    });

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    const qrCodeValid = verifyQRCode(qrCode, systemId);
    const locationValid = verifyLocation(location, 'LabLocation123');

    const verificationStatus = qrCodeValid && locationValid;

    attendance.qrCodeValid = qrCodeValid;
    attendance.locationValid = locationValid;
    attendance.verificationStatus = verificationStatus;
    attendance.logoutTime = new Date();

    await attendance.save();

    return res.status(200).json({ message: 'Logout successful', attendance });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ error: 'Internal Server Error during logout' });
  }
};

// Function to generate attendance report
exports.generateReport = async (req, res) => {
  const { courseId, startDate, endDate } = req.query;

  try {
    const report = await Attendance.find({
      courseId,
      loginTime: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    if (report.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for the specified period.' });
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: 'Error generating report' });
  }
};

// Function to save the final report from CameraScreen
exports.saveReport = async (req, res) => {
    
    const { rollNumber, courseID, status, loginTime, verificationStatus, qrCodeData } = req.body;
    console.log('Received request to save report:', req.body);

  try {
    const attendance = new Attendance({
      rollNumber,
      courseID,
      status,
      loginTime,
      verificationStatus,
      qrCodeData,
    });

    await report.save();

        res.status(200).json({ message: 'Report saved successfully', report });
    } catch (error) {
        console.error('Error saving report:', error);
        res.status(500).json({ error: 'Failed to save report' });
    }
};
