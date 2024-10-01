const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/student');
const verifyQRCodeRoutes = require('./routes/verifyQRCode'); // Import the new QR code verification route
const verifyLocationRoute = require('./routes/verifyLocation');
const attendanceRoutes = require('./routes/attendanceRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/verifyQRCode', verifyQRCodeRoutes); // Use the QR code verification route
app.use('/api/verifyLocation', verifyLocationRoute);
app.use('/api/attendance', attendanceRoutes);
// Error handling for invalid routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
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
