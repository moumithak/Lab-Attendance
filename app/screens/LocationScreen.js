import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import * as Location from 'expo-location';

function LocationScreen() {
  // State to hold location and error messages
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Function to request location permission and get location
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      Alert.alert('Permission Denied', 'Location access is required to get the coordinates.');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
  };

  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      <View style={{ marginTop: 10, padding: 10, borderRadius: 10, width: '40%' }}>
        <Button title="Get Location" onPress={getLocation} />
      </View>
      {location ? (
        <View style={{ marginTop: 10 }}>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      ) : errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <Text>No location data available</Text>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationScreen;