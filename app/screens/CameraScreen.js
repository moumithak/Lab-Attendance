import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import * as Application from 'expo-application'; 
import { useRoute, useNavigation } from '@react-navigation/native';

const BASE_URL = 'http://192.168.29.150:5000';

function CameraScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [deviceId, setDeviceId] = useState(null);
  const [locationVerified, setLocationVerified] = useState(null);
  const navigation = useNavigation();

  const route = useRoute();
  const rollNumber = route.params?.rollNumber || 'N/A';
  const courseID = route.params?.courseID || 'N/A';
  const status = "Logged In"; // Assuming status is 'Logged In' for this example
  const loginTime = new Date().toLocaleString(); // Current time as login time

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log('Camera permission status:', status);
    };

    const fetchDeviceId = async () => {
      const id = Application.androidId || Application.iosId;
      setDeviceId(id);
      console.log('Device ID:', id);
    };

    getBarCodeScannerPermissions();
    fetchDeviceId();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setData(data);
  
    console.log('Sending data to backend for verification:', data);
    const response = await verifyQRCode(data.trim());
    console.log('Response from backend:', response);
  
    if (response.valid) {
      Alert.alert('Success', 'The QR code is valid. Proceeding to location verification...', [
        {
          text: 'OK', 
          onPress: async () => {
            const isLocationVerified = await requestLocationPermission(response.location);
            setLocationVerified(isLocationVerified);
            showLocationVerificationDialog(isLocationVerified);
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
      const currentLocation = await Location.getCurrentPositionAsync({});
      console.log('Current location:', currentLocation);
      const isValidLocation = await sendLocationToBackend(currentLocation.coords, qrCodeLocation);
      return isValidLocation;
    } else {
      Alert.alert('Permission to access location was denied');
      return false;
    }
  };

  const sendLocationToBackend = async (currentLocation, qrCodeLocation) => {
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
          deviceId,
        }),
      });
      const result = await response.json();
      console.log('Location verification response:', result);
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
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  dataText: {
    fontSize: 16,
    color: 'black',
  },
});

export default CameraScreen; 