const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  attendanceId: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true },
  systemId: { type: String, required: true },
  loginTime: { type: Date },
  logoutTime: { type: Date },
  courseID: { type: String, required: true },
  verificationStatus: { type: Boolean, default: false },
  qrCodeValid: { type: Boolean, default: false },
  locationValid: { type: Boolean, default: false }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
