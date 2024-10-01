import FrontScreen from './app/screens/FrontScreen';
import ScanScreen from './app/screens/ScanScreen';
import StudentScreen from './app/screens/StudentScreen';
import TeacherScreen from './app/screens/TeacherScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import ScannerScreen from './app/screens/ScannerScreen';

import React from 'react';
import { useCameraPermissions } from "expo-camera";
import CameraScreen from './app/screens/CameraScreen';
import LocationScreen from './app/screens/LocationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Front">
        <Stack.Screen name="FrontScreen" component={FrontScreen} options={{ title: 'Welcome' }} />
        <Stack.Screen name="StudentScreen" component={StudentScreen} options={{ title: 'Student' }} />
        <Stack.Screen name="TeacherScreen" component={TeacherScreen} options={{ title: 'Staff' }} />
        <Stack.Screen name="ScanScreen" component={ScanScreen} options={{ title: 'Scan' }} />
        <Stack.Screen name="ScannerScreen" component={ScannerScreen} options={{ title: 'ScanQR' }} />
        <Stack.Screen name="LocationScreen" component={LocationScreen} options={{ title: 'ScanQR' }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}