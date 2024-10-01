const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  qrCodeId: { type: String, required: true },
  qrCodeData: { type: String, required: true, unique: true }, // Ensure this matches the field in the database
  systemId: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    range: { type: Number, required: true },
  },
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
