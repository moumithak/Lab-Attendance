import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

  // Function to handle the login button press
  const handleLoginPress = () => {
    if (!rollNumber || !courseID) {
      Alert.alert('Error', 'Please fill in all fields');
    } else if (!validateRollNumber(rollNumber)) {
      Alert.alert('Error', 'Invalid Roll Number format. Example: 22z264');
    } else if (!validateCourseID(courseID)) {
      Alert.alert('Error', 'Invalid Course ID format. Example: 19z501');
    } else {
      // If both fields are valid, navigate to ScanScreen with the entered data
      navigation.navigate('ScanScreen', { rollNumber, courseID });
    }
  };
  const handleLogoutPress = () => {
    if (!rollNumber || !courseID) {
      Alert.alert('Error', 'Please fill in all fields');
    } else if (!validateRollNumber(rollNumber)) {
      Alert.alert('Error', 'Invalid Roll Number format. Example: 22z264');
    } else if (!validateCourseID(courseID)) {
      Alert.alert('Error', 'Invalid Course ID format. Example: 19z501');
    } else {
      // If both fields are valid, navigate to ScanScreen with the entered data
      navigation.navigate('ScanScreen', { rollNumber, courseID });
    }
  };

  return (
    <View style={styles.container}>
      {/* Roll Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Roll Number (e.g., 22z264)"
        value={rollNumber}
        onChangeText={setRollNumber}
      />

      {/* Course ID Input */}
      <TextInput
        style={styles.input}
        placeholder="Course ID (e.g., 19z501)"
        value={courseID}
        onChangeText={setCourseID}
      />

      {/* Login Button */}
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
    flex: 1, // Make the button fill available space
    marginHorizontal: 5, // Add space between the buttons
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'space-between', // Add space between buttons
    width: '80%', // Set container width to match input fields
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default StudentScreen;
