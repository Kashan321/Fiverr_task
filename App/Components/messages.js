import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebSocket from 'react-native-websocket';
import MessageHeader from './MessageHeader';

const MessagesScreen = ({ route }) => {
  const { params } = route;
  const { username, chatId, avatarUrl } = params;

  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'Hello! This is a mock message.',
      timestamp: new Date().toISOString(),
      sender: { id: 1, name: 'User1' },
      is_announcement: false,
    },
    {
      id: '2',
      content: 'This is an announcement.',
      timestamp: new Date().toISOString(),
      sender: null,
      is_announcement: true,
    },
    {
      id: '3',
      content: 'Hello',
      timestamp: new Date().toISOString(),
      sender: null,
      is_announcement: true,
    },
    {
      id: '4',
      content: 'Hi',
      timestamp: new Date().toISOString(),
      sender: null,
      is_announcement: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [socketUrl, setSocketUrl] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const fetchSessionToken = async () => {
      try {
        const token = await AsyncStorage.getItem('@session_token');
        if (token && chatId) {
          const url = `ws://your_websocket_url_here/ws/chat/${chatId}/?token=${token}`;
          setSocketUrl(url);
        }
      } catch (error) {
        console.error('Error retrieving token', error);
      }
    };

    fetchSessionToken();
  }, [chatId]);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('@user_id');
        setUserId(parseInt(id, 10));
      } catch (error) {
        console.error('Error retrieving user ID', error);
      }
    };

    getUserId();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      id: (messages.length + 1).toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: { id: userId, name: 'You' },
      is_announcement: false,
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  const renderItem = ({ item }) => {
    const isAnnouncement = item.is_announcement;

    if (isAnnouncement) {
      return (
        <View style={[styles.messageContainer, styles.messageOut]}>
          <View style={[styles.bubble, styles.bubbleOut]}>
            <Text style={styles.messageContent}>{item.content}</Text>
            <Text style={styles.messageTimestamp}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, styles.messageIn]}>
        <View style={[styles.bubble, styles.bubbleIn]}>
          <Text style={styles.messageContent}>{item.content}</Text>
          <Text style={styles.messageTimestamp}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MessageHeader username={username} avatarUrl={avatarUrl} />
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardHeight} // Adjust height offset for keyboard
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 16 }}
        />
        {socketUrl ? (
          <WebSocket
            url={socketUrl}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.data);
                const message = data.message || data;
                setMessages((prevMessages) => [...prevMessages, message]);
              } catch (error) {
                console.error('Error parsing WebSocket message:', error);
              }
            }}
            onError={(error) => console.error('WebSocket error:', error)}
            onClose={(event) => console.log('WebSocket closed:', event)}
            reconnect
          />
        ) : null}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  innerContainer: {
    flex: 1,
    paddingBottom: 10, // Add padding to the bottom to avoid overlap with input
  },
  messageContainer: {
    marginVertical: 5,
    flexDirection: 'row',
  },
  messageIn: {
    justifyContent: 'flex-end',
  },
  messageOut: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleIn: {
    backgroundColor: '#D3E5FF',
    borderTopLeftRadius: 0,
  },
  bubbleOut: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 0,
  },
  messageContent: {
    fontSize: 16,
  },
  messageTimestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MessagesScreen;
