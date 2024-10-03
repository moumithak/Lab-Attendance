import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';

const BASE_URL = 'http://10.0.2.2:5000';

function CameraScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [location, setLocation] = useState(null); // Store user location here
  const [locationVerified, setLocationVerified] = useState(null);
  const navigation = useNavigation();

  const route = useRoute();
  const rollNumber = route.params?.rollNumber || 'N/A';
  const courseID = route.params?.courseID || 'N/A';
  const status = route.params?.status || 'N/A';
  const loginTime = new Date().toLocaleString(); // Current time as login time

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setData(data);

    const response = await verifyQRCode(data.trim());
  
    if (response.valid) {
      Alert.alert('Success', 'The QR code is valid. Proceeding to location verification...', [
        {
          text: 'OK', 
          onPress: async () => {
            const isLocationVerified = await requestLocationPermission(response.location);
            setLocationVerified(isLocationVerified);
            showLocationVerificationDialog(isLocationVerified);
            await saveDataToBackend(isLocationVerified, status, response.systemId);
          }
        }
      ]);
    } else {
      Alert.alert('Invalid QR Code', 'The scanned QR code is not valid.');
      setScanned(false);
    }
  };

  const verifyQRCode = async (qrCodeData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/verifyQRCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodeData }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error verifying QR Code:', error);
      return { valid: false };
    }
  };

  const requestLocationPermission = async (qrCodeLocation) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords); // Save the location
        const isValidLocation = await sendLocationToBackend(currentLocation.coords, qrCodeLocation);
        return isValidLocation;
      } catch (error) {
        console.error('Error fetching location:', error);
        return false;
      }
    } else {
      Alert.alert('Permission to access location was denied');
      return false;
    }
  };

  const sendLocationToBackend = async (currentLocation, qrCodeLocation) => {
    if (!currentLocation || !qrCodeLocation) {
      console.error('Current location or QR code location is missing.');
      return false;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/verifyLocation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userLocation: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
          qrCodeLocation: {
            latitude: qrCodeLocation.latitude,
            longitude: qrCodeLocation.longitude,
            range: qrCodeLocation.range,
          },
        }),
      });
      const result = await response.json();
      return result.valid;
    } catch (error) {
      console.error('Error sending location:', error);
      return false;
    }
  };

  const showLocationVerificationDialog = (isLocationValid) => {
    Alert.alert(
      isLocationValid ? 'Location Verified' : 'Location Unverified', 
      isLocationValid ? 'Location verification successful.' : 'Location verification failed.',
      [
        { 
          text: 'OK', 
          onPress: () => showFinalDetailsDialog(isLocationValid) 
        }
      ]
    );
  };

  const showFinalDetailsDialog = async (isLocationValid) => {
    Alert.alert('Login Details', 
      `Roll Number: ${rollNumber}\n` +
      `Course ID: ${courseID}\n` +
      `Status: ${status}\n` +
      `Login Time: ${loginTime}\n` +
      `Location Verified: ${isLocationValid ? 'Valid' : 'Invalid'}\n` +
      `QR Code Data: ${data}`, 
      [{ text: 'OK', onPress: () => navigation.navigate('FrontScreen') }]
    );
  };

  const saveDataToBackend = async (isLocationVerified, status, systemId) => {
    
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords; // Destructure to get latitude and longitude
      
      const currentTime = new Date(); // Get the current time

      const response = await fetch(`${BASE_URL}/api/save/${status}`, { // Dynamic endpoint based on status
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNumber,
          courseID,
          systemId, // Make sure to send systemId
          location: { // Use the stored location
            latitude,
            longitude,
          },
          status,
          loginTime: status === 'login' ? currentTime : undefined, // Save current time for login, undefined for logout
          logoutTime: status === 'logout' ? currentTime : undefined, // Save current time for logout
          verificationStatus: isLocationVerified, // Include verification status
        }),
      });
      if (response.ok) {
        Alert.alert(
          `${status === 'login' ? 'Login' : 'Logout'} Successful`,
          `Your ${status} has been recorded.`
        );
      } else {
        const errorResponse = await response.json(); // Log error response
        console.error('Error response from backend:', errorResponse);
        Alert.alert(
          'Error',
          `Failed to save ${status} data: ` + errorResponse.message
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      {scanned && (
        <Button
          title={'Tap to Scan Again'}
          onPress={() => setScanned(false)}
        />
      )}

      {data ? (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Scanned Data: {data}</Text>
        </View>
      ) : (
        <Text style={styles.scanText}>Point your camera at a QR code to scan</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'black',
    padding: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  dataContainer: {
    margin: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  dataText: {
    fontSize: 16,
  },
});

export default CameraScreen;
