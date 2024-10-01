const express = require('express');
const router = express.Router();
const QRCode = require('../models/QRCode');

// Route to verify the QR Code
router.post('/', async (req, res) => {
  const { qrCodeData } = req.body;

  try {
    // Trim and convert to lowercase for case-insensitive comparison
    const trimmedQRCode = qrCodeData.trim().toLowerCase();
    
    const foundQRCode = await QRCode.findOne({ qrCodeData: trimmedQRCode });

    

    if (foundQRCode) {
      return res.json({
        valid: true,
        qrCodeId: foundQRCode.qrCodeId,
        systemId: foundQRCode.systemId,
        location: foundQRCode.location,
      });
    } else {
      return res.status(400).json({ valid: false, error: 'QR Code not found' });
    }
  } catch (error) {
    console.error('Error while verifying QR Code:', error);
    return res.status(500).json({ valid: false, error: 'Internal server error' });
  }
});

module.exports = router;
