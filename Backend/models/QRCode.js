const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  qrCodeData: { type: String, required: true, unique: true }, 
  systemId: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    range: { type: Number, required: true },
  },
});

if (mongoose.models.QRCode) {
  delete mongoose.models.QRCode;
}

const QRCode = mongoose.models.QRCode || mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
