import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Pressable, Platform, TouchableOpacity } from 'react-native';

function TeacherScreen(props) {
  const [password, setPassword] = useState('');
  const [courseID, setCourseID] = useState('');
  const [facultyID, setFacultyID] = useState('');

  return (
    <View style={styles.container}>
      

      {/* Roll Number Input */}
      <TextInput
        style={styles.input}
        placeholder="FacultyID"
        value={facultyID}
        onChangeText={setFacultyID}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      {/* Course ID Input */}
      <TextInput
        style={styles.input}
        placeholder="Course ID"
        value={courseID}
        onChangeText={setCourseID}
      />

      {/* Login & Logout Buttons */}
      <View style={styles.fixToText}>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#ddd' : '#fff',
            },
            styles.customButton,
          ]}
          onPress={() => console.log('Login button pressed')}
        >
          <Text style={styles.buttonText}>Login</Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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

  fixToText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  customButton: {
    borderColor: 'black',
    borderWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },

  backButton: {
    position: 'absolute',
    top: 50,  // Adjust this according to your layout
    left: 20,
  },
});

export default TeacherScreen;