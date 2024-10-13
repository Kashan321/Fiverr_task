import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MessagesScreen from './App/Components/messages';

export default function App() {

  const params = {
    avatarUrl: "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    username: 'John Doe',
    chatId: 1, // Added chatId
    messages: [
      {
        id: 1,
        text: 'Hello, how are you?',
        createdAt: new Date(),
      },
      {
        id: 2,
        text: 'I\'m doing well, thank you!',
        createdAt: new Date(),
      },
    ],
  }

  return (
    <View style={styles.container}>
      <MessagesScreen route={{ params }} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
