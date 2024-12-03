import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CounterCard({ title, count }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'rgba(52, 232, 158, 0.3)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  title: {
    fontSize: 18,
    color: '#fff',
  },
  count: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
});
