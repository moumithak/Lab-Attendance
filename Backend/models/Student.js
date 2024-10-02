const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  courseID: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  systemId: { type: String, required: true },
  status: { type: String, required: true }, // 'login' or 'logout'
  verificationStatus: { type: Boolean, default: false },
  loginTime: { type: Date },  // Only for login
  logoutTime: { type: Date }  // Only for logout
});

if (mongoose.models.Student) {
  delete mongoose.models.Student;
}

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
module.exports = Student;

