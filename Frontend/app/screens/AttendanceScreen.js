import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system'; 
import * as Sharing from 'expo-sharing'; 

const BASE_URL = 'http://^^:5000'; // use your network's ip address when running in place of ^^

function AttendanceScreen({ route }) {
  const { courseID } = route.params;
  const [attendanceData, setAttendanceData] = useState([]);
  const [csvFilePath, setCsvFilePath] = useState('');

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/attendance/${courseID}`);
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [courseID]);

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.rollNumber}</Text>
      <Text style={styles.tableCell}>{item.systemId}</Text>
      <Text style={styles.tableCell}>{new Date(item.loginTime).toLocaleDateString()}</Text>
      <Text style={styles.tableCell}>{new Date(item.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      <Text style={styles.tableCell}>{new Date(item.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      <Text style={styles.tableCell}>{item.verificationStatus ? 'Verified' : 'Not Verified'}</Text>
    </View>
  );

  const convertToCSV = () => {
    const header = 'Roll Number,System ID,Date,Login Time,Logout Time,Verification Status\n';
    const rows = attendanceData.map(item => {
        const date = new Date(item.loginTime).toLocaleDateString().replace(/\s+/g, '');
        const loginTime = new Date(item.loginTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).trim().replace(/\s+/g, '');
        const logoutTime = new Date(item.logoutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).trim().replace(/\s+/g, '');
        const verificationStatus = item.verificationStatus ? 'Verified' : 'Not Verified';
        return `${item.rollNumber},${item.systemId},${date},${loginTime},${logoutTime},${verificationStatus}`;
    }).join('\n');

    return header + rows;
  };

  const saveCSVFileToDownloads = async () => {
    try {
      const csvContent = convertToCSV();
      const fileName = `attendance_${courseID}.csv`;

      // Save to Android's public Downloads folder
      let fileUri = `${FileSystem.documentDirectory}${fileName}`;
      if (Platform.OS === 'android') {
        const externalUri = `${FileSystem.cacheDirectory}${fileName}`;
        
        await FileSystem.writeAsStringAsync(externalUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
        
        const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permission.granted) {
          const directoryUri = permission.directoryUri;
          await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, 'text/csv')
            .then(async (uri) => {
              await FileSystem.writeAsStringAsync(uri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
              fileUri = uri;
              setCsvFilePath(uri); // Save file path for sharing
              Alert.alert('Success', `File saved successfully`);
            })
            .catch((err) => {
              console.error('Error saving to downloads:', err);
              Alert.alert('Error', 'Could not save the file to Downloads.');
            });
        }
      } else {
        // iOS or other platforms
        await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
        setCsvFilePath(fileUri); // Save file path for sharing
        Alert.alert('Success', `File saved successfully`);
      }

    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Could not save the file.');
    }
  };

  const shareCSVFile = async () => {
    try {
      const csvContent = convertToCSV(); // Generate CSV content
      const tempFileUri = `${FileSystem.documentDirectory}attendance_${courseID}.csv`;

      // Write CSV content to a temporary file
      await FileSystem.writeAsStringAsync(tempFileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

      // Share the file directly without needing to save it permanently
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(tempFileUri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      Alert.alert('Error', 'Could not share the file.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance for Course ID: {courseID}</Text>
      <FlatList
        data={attendanceData}
        keyExtractor={(item) => item.attendanceId}
        renderItem={renderAttendanceItem}
        ListHeaderComponent={
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Roll Number</Text>
            <Text style={styles.tableHeaderCell}>System ID</Text>
            <Text style={styles.tableHeaderCell}>Date</Text>
            <Text style={styles.tableHeaderCell}>Login Time</Text>
            <Text style={styles.tableHeaderCell}>Logout Time</Text>
            <Text style={styles.tableHeaderCell}>Verification Status</Text>
          </View>
        }
      />
      <Button title="Save Attendance CSV" onPress={saveCSVFileToDownloads} />
      <Button title="Share Attendance CSV" onPress={shareCSVFile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
  },
});

export default AttendanceScreen;
