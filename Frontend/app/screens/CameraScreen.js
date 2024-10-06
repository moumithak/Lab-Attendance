import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';

const BASE_URL = 'http://192.168.29.150:5000';

function CameraScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(''); // QR code data
  const [location, setLocation] = useState(null); // Store user location here
  const [locationVerified, setLocationVerified] = useState(null);
  const [systemId, setSystemId] = useState(null); // Store systemId after QR verification

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

  useEffect(() => {
    // This ensures the dialog only shows after data is updated
    if (data && systemId && locationVerified !== null) {
      showFinalDetailsDialog(locationVerified); // Trigger final dialog here after all states are set
    }
  }, [data, systemId, locationVerified]);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setData(data); // Store QR code data

    const response = await verifyQRCode(data.trim());
    if (response.valid) {
      setSystemId(response.systemId); // Store systemId
      Alert.alert('Success', 'The QR code is valid. Proceeding to location verification...', [
        {
          text: 'OK', 
          onPress: async () => {
            const isLocationVerified = await requestLocationPermission(response.location);
            setLocationVerified(isLocationVerified); // Now, this will trigger the final dialog
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
      const res = await response.json();
      return res;
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

  const showFinalDetailsDialog = async (isLocationValid) => {
    Alert.alert('Login Details', 
      `Roll Number: ${rollNumber}\n` +
      `Course ID: ${courseID}\n` +
      `Status: ${status}\n` +
      `Login Time: ${loginTime}\n` +
      `Location Verified: ${isLocationValid ? 'Valid' : 'Invalid'}\n` +
      `QR Code Data: ${data}`, // Include QR code data
      [{ text: 'OK', onPress: async () => {
        await saveDataToBackend(isLocationValid, status, systemId); 
      }}]
    );
  };
  
  const saveDataToBackend = async (isLocationVerified, status, systemId) => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords; // Destructure to get latitude and longitude
      const currentTime = new Date(); // Get the current time

      const response = await fetch(`${BASE_URL}/api/save/${status}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNumber,
          courseID,
          systemId,
          location: {
            latitude,
            longitude,
          },
          status,
          loginTime: status === 'login' ? currentTime : undefined,
          logoutTime: status === 'logout' ? currentTime : undefined,
          verificationStatus: isLocationVerified, 
        }),
      });

      if (response.ok) {
        Alert.alert(
          `${status === 'login' ? 'Login' : 'Logout'} Successful`,
          `Your ${status} has been recorded.`,
          [{ text: 'OK', onPress: () => {
              // Reset states after successful login/logout
              setScanned(false);
              setData(''); // Clear QR code data
              navigation.navigate('FrontScreen');
            }
          }]
        );
      } else {
        const errorResponse = await response.json();
        console.error('Error response from backend:', errorResponse);
        Alert.alert('Error', `Failed to save ${status} data: ${errorResponse.message}`);
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
      ) : null}
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dataContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  dataText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
