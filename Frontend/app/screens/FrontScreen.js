import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, Platform } from 'react-native';
import { useDimensionsn, useDeviceOrientation } from '@react-native-community/hooks';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


function FrontScreen({navigation}) {
    console.log("App Executed");
  const {landscape} = useDeviceOrientation();
  return (
    <View style={styles.container}>
      <Image
        fadeDuration={700}
        source={require('../assets/icon.jpg')}  
        style={{ width: 350, height: 350, borderRadius:50}}  
      />
      <Text style={styles.baseText}>
        Lab Track
      </Text>
      <View style={styles.fixToText}>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#ddd' : '#fff', 
            },
            styles.customButton,
          ]}
          onPress={() => navigation.navigate('StudentScreen')}
        >
          <Text style={styles.buttonText}>Student</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#ddd' : '#fff', 
            },
            styles.customButton,
          ]}
          onPress={() => navigation.navigate('TeacherScreen')}
        >
          <Text style={styles.buttonText}>Staff</Text>
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
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  
export default FrontScreen;