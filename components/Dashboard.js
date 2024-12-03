import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CounterCard from './CounterCard';
import Charts from './Charts';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas de Uso</Text>

      <View style={styles.counters}>
        <CounterCard title="Total de Productos" count="1,234" />
        <CounterCard title="Movimientos Hoy" count="56" />
        <CounterCard title="Usuarios Activos" count="89" />
        <CounterCard title="Pedidos Pendientes" count="24" />
      </View>

      <Charts />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    color: '#34e89e',
    textAlign: 'center',
    marginBottom: 20,
  },
  counters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
