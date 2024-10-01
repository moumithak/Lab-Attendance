const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  courseId: { type: String, required: true },
  location: { type: String }, // GPS location
  qrCodeId: { type: String, required: true },
  status: { type: String },
  verificationStatus: { type: Boolean, default: false },
  logintime: { type: Date, default: Date.now },
  logouttime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
