import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { useRoute } from '@react-navigation/native';
import * as Application from 'expo-application'; // Importing the Application module

function CameraScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [location, setLocation] = useState(null);
  const [deviceId, setDeviceId] = useState(null); // State to store device ID

  const route = useRoute();
  
  const rollNumber = route.params?.rollNumber || 'N/A';
  const courseID = route.params?.courseID || 'N/A';

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    const getLocationPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
      }
    };

    const fetchDeviceId = () => {
      const id = Application.androidId || Application.iosId; // Fetching the device ID
      setDeviceId(id);
    };

    getBarCodeScannerPermissions();
    getLocationPermissions();
    fetchDeviceId(); // Fetch device ID when the component is mounted
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setData(data);
  
    // Get current location
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
  
    // Get current time
    const currentTime = new Date().toLocaleTimeString();
  
    // Extract the two-digit system number and lab name from the data
    const [systemNumber, labName] = data.split(',');
  
    // Create the string with all necessary details, including device ID
    const scannedInfo = `
      System No: ${systemNumber}
      Lab: ${labName}
      Roll Number: ${rollNumber}
      Course ID: ${courseID}
      Time: ${currentTime}
      Location: (${currentLocation.coords.latitude}, ${currentLocation.coords.longitude})
      Device ID: ${deviceId} 
    `;
  
    // Display alert with the scanned data and OK button
    Alert.alert('QR Code Scanned!', scannedInfo, [
      {
        text: 'OK',
        onPress: () => writeToFile(scannedInfo), // Store data when OK is pressed
      },
    ]);
  };
  

  const writeToFile = async (content) => {
    try {
      const fileUri = FileSystem.documentDirectory + 'scannedData.txt';
      await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
      Alert.alert('Success', 'Data saved to file');
    } catch (error) {
      console.log('Error writing to file:', error);
      Alert.alert('Error', 'Failed to save data to file');
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
