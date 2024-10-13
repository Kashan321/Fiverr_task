import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';


const MessageHeader = ({ username, avatarUrl, onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Text style={styles.backButtonText}><Ionicons name="arrow-back" size={24} color="black" /></Text>
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={styles.username}>{username}</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0', 
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  
  },
  backButton: {
    marginRight: 10,
    marginTop: 23,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0B93F6', 
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 23,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    
  },
});

export default MessageHeader;
