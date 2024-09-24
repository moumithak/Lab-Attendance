import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

function ScanScreen(props) {
  const navigation = useNavigation();
  const route = useRoute();

  // Extract rollNumber and courseID from route params
  const { rollNumber, courseID } = route.params || {};

  return (
    <View style={styles.container}>
      <Image
        fadeDuration={700}
        source={{
          width: 400,
          height: 300,
          uri: "https://thumbs.dreamstime.com/b/online-education-learning-growth-technology-illustration-depicting-online-education-computer-books-325355771.jpg",
        }}
      />
      <Text style={styles.baseText}>Lab Attendance</Text>

      <View style={styles.fixToText}>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#ddd' : '#fff',
            },
            styles.customButton,
          ]}
          onPress={() =>
            // Pass rollNumber and courseID when navigating to CameraScreen
            navigation.navigate('CameraScreen', { rollNumber, courseID })
          }
        >
          <Text style={styles.buttonText}>Scan QR Code</Text>
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

  baseText: {
    fontWeight: 'bold',
    paddingBottom: 20,
    fontSize: 40,
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
});

export default ScanScreen;
