import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button } from 'react-native';

const BASE_URL = 'http://192.168.29.150:5000';

function AttendanceScreen({ route }) {
  const { courseID } = route.params;
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchAttendanceData = async () => {
    try {
      console.log("Fetching attendance data for Course ID:", courseID);
      const response = await fetch(`${BASE_URL}/api/attendance/${courseID}`);
      const data = await response.json();
      console.log("Attendance Data:", data);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [courseID]); // Fetch data when the component mounts or when courseID changes

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
      <Button title="Download Attendance" onPress={() => { /* Implement download logic here */ }} />
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
