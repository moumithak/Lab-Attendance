import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions } from "expo-camera";

function ScannerScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={{ gap: 20 }}>
        <Pressable onPress={requestPermission}>
          <Text style={styles.buttonStyle}>Request Permissions</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('CameraScreen')} disabled={!isPermissionGranted}>
          <Text
            style={[
              styles.buttonStyle,
              { opacity: !isPermissionGranted ? 0.5 : 1 },
            ]}
          >
            Scan Code
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default ScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "black",
    fontSize: 40,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 23,
    textAlign: "center",
  },
});
