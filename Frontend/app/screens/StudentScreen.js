import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const BASE_URL = 'http://192.168.29.150:5000'; // Replace with your local machine IP address

function StudentScreen(props) {
  const [rollNumber, setRollNumber] = useState('');
  const [courseID, setCourseID] = useState('');
  const navigation = useNavigation();

  // Function to validate roll number format
  const validateRollNumber = (roll) => {
    const rollNumberRegex = /^\d{2}[a-zA-Z]\d{3}$/;
    return rollNumberRegex.test(roll);
  };

  // Function to validate course ID format
  const validateCourseID = (course) => {
    const courseIDRegex = /^\d{2}[a-zA-Z]\d{3}$/;
    return courseIDRegex.test(course);
  };

  // Function to handle login button press
  const handleLoginPress = async () => {
    if (!rollNumber || !courseID) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateRollNumber(rollNumber)) {
      Alert.alert('Error', 'Invalid Roll Number format. Example: 22z264');
      return;
    }

    if (!validateCourseID(courseID)) {
      Alert.alert('Error', 'Invalid Course ID format. Example: 19z501');
      return;
    }

    // Send data to backend and await validation (QR code + Location)
    try {
      const response = await fetch(`${BASE_URL}/api/student/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNumber: rollNumber,
          courseID: courseID,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // If QR code and location are verified
        navigation.navigate('ScanScreen', { rollNumber, courseID });
      } else {
        Alert.alert('Login Failed', 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  // Function to handle logout button press
  const handleLogoutPress = async () => {
    if (!rollNumber || !courseID) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateRollNumber(rollNumber)) {
      Alert.alert('Error', 'Invalid Roll Number format. Example: 22z264');
      return;
    }

    if (!validateCourseID(courseID)) {
      Alert.alert('Error', 'Invalid Course ID format. Example: 19z501');
      return;
    }

    // Send data to backend and await validation (QR code + Location)
    try {
      const response = await fetch(`${BASE_URL}/api/student/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNumber: rollNumber,
          courseID: courseID,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // If QR code and location are verified
        navigation.navigate('ScanScreen', { rollNumber, courseID });
      } else {
        Alert.alert('Logout Failed', 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Roll Number (e.g., 22z264)"
        value={rollNumber}
        onChangeText={setRollNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Course ID (e.g., 19z501)"
        value={courseID}
        onChangeText={setCourseID}
      />

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            { backgroundColor: pressed ? '#ddd' : '#fff' },
            styles.customButton,
          ]}
          onPress={handleLoginPress}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            { backgroundColor: pressed ? '#ddd' : '#fff' },
            styles.customButton,
          ]}
          onPress={handleLogoutPress}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
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
  input: {
    width: '80%',
    height: 60,
    borderColor: 'black',
    borderWidth: 3,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    fontSize: 17,
  },
  customButton: {
    borderColor: 'black',
    borderWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default StudentScreen;
