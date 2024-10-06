import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function TeacherScreen() {
  const [facultyID, setFacultyID] = useState('');
  const [courseID, setCourseID] = useState('');
  const navigation = useNavigation();

  // Validate Faculty ID (Format Example: C6509)
  const validateFacultyID = (id) => {
    const facultyIDRegex = /^[A-Za-z]\d{4,5}$/;
    return facultyIDRegex.test(id);
  };

  // Validate Course ID (Format: 2 digits, 1 letter, 3 digits)
  const validateCourseID = (course) => {
    const courseIDRegex = /^\d{2}[a-zA-Z]\d{3}$/;
    return courseIDRegex.test(course);
  };

  const handleViewAttendance = () => {
    if (!validateFacultyID(facultyID)) {
      Alert.alert('Invalid Faculty ID', 'Please enter a valid Faculty ID');
      return;
    }
    if (!validateCourseID(courseID)) {
      Alert.alert('Invalid Course ID', 'Please enter a valid Course ID');
      return;
    }

    // Navigate to AttendanceScreen with the valid courseID
    navigation.navigate('AttendanceScreen', { courseID });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Faculty ID"
        value={facultyID}
        onChangeText={setFacultyID}
      />
      <TextInput
        style={styles.input}
        placeholder="Course ID"
        value={courseID}
        onChangeText={setCourseID}
      />
      <Pressable style={styles.customButton} onPress={handleViewAttendance}>
        <Text style={styles.buttonText}>View Attendance</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
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
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default TeacherScreen;
