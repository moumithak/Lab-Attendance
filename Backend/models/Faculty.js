const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  courseId: { type: String, required: true },
});

module.exports = mongoose.model('Faculty', FacultySchema);
