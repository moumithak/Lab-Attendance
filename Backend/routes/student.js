const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the Student schema
const studentSchema = new mongoose.Schema({
  rollNumber: String,
  courseID: String,
  status: String, // Either 'login' or 'logout'
  timestamp: { type: Date, default: Date.now }, // Automatically saves the current time
});

const Student = mongoose.model('Student', studentSchema);

// POST route for student login
router.post('/login', async (req, res) => {
  const { rollNumber, courseID } = req.body;

  // Check if roll number and course ID are provided
  if (!rollNumber || !courseID) {
    return res.status(400).json({ message: 'Roll number and course ID are required' });
  }

  try {
    // Create a new student document for login
    const newLogin = new Student({
      rollNumber,
      courseID,
      status: 'login', // Set status to login
      timestamp: new Date(), // Record current time
    });

    // Save the student login status to the database
    await newLogin.save();

    return res.status(201).json({ message: 'Student login recorded successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving login data', error });
  }
});

// POST route for student logout
router.post('/logout', async (req, res) => {
  const { rollNumber, courseID } = req.body;

  // Check if roll number and course ID are provided
  if (!rollNumber || !courseID) {
    return res.status(400).json({ message: 'Roll number and course ID are required' });
  }

  try {

    // Create a new student document for logout
    const newLogout = new Student({
      rollNumber,
      courseID,
      status: 'logout', // Set status to logout
      timestamp: new Date(), // Record current time
    });

    // Save the student logout status to the database
    await newLogout.save();

    return res.status(201).json({ message: 'Student logout recorded successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving logout data', error });
  }
});

module.exports = router;
