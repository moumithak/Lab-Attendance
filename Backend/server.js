const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/student');
const verifyQRCodeRoutes = require('./routes/verifyQRCode'); // Import the new QR code verification route
const verifyLocationRoutes = require('./routes/verifyLocation');
const attendanceRoutes = require('./routes/attendanceRoutes');
const saveRoutes=require('./routes/save');

const Attendance = require('./models/Attendance');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/verifyQRCode', verifyQRCodeRoutes); 
app.use('/api/verifyLocation', verifyLocationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/save',saveRoutes);
app.get('/api/attendance/:courseID', async (req, res) => {
  try {
    const courseID = req.params.courseID; // Capture the courseID from the URL parameters
    const attendanceRecords = await Attendance.find({ courseID });
    console.log("Record:", attendanceRecords);
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attendance data' });
  }
});
// Error handling for invalid routes
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for '${req.url}'`);
  next();
});


// Connect to MongoDB
mongoose.connect('mongodb+srv://moumi17:km123@cluster0.nuu2n.mongodb.net/SystemLab?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
