const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  courseId: { type: String, required: true },
  rollNumber: { type: String, required: true },
  status: { type: String, default: 'available' },
});

module.exports = mongoose.model('Device', DeviceSchema);
