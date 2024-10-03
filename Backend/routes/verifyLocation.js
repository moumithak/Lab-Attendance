const express = require('express');
const router = express.Router();

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const R = 6371000; // Radius of the Earth in meters
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    return distance;
};

// Route to verify the location
router.post('/', (req, res) => {
    const { userLocation, qrCodeLocation } = req.body;
    console.log(req.body);
    console.log('User Location:', userLocation);
    console.log('QR Code Location:', qrCodeLocation);

    // Calculate distance and check if user is within the allowed range
    const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        qrCodeLocation.latitude,
        qrCodeLocation.longitude
    );

    console.log(`Calculated Distance: ${distance} meters`);

    if (distance <= qrCodeLocation.range) {
        console.log('Location verification successful');
        return res.json({ valid: true, message: 'Location is valid' });
    } else {
        console.log('Location verification failed');
        return res.status(400).json({ valid: false, message: 'Location is not valid' });
    }
});

module.exports = router;
