// screens/ChatSupportScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatSupportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat de Soporte en Tiempo Real</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  text: {
    fontSize: 20,
    color: '#4CAF50',
  },
});

export default ChatSupportScreen;
