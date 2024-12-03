// screens/StatisticsScreen.js
import React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import ScreenHeader from '../components/ScreenHeader';

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen = ({navigation}) => {
  // Datos de ejemplo para gráficos
  const stockData = [12, 19, 10, 5, 3, 8]; // Niveles de inventario por categoría
  const categories = ['Transformadores', 'Cables', 'Medidores', 'Interruptores', 'Fusibles', 'Conectores'];
  
  const barData = {
    labels: categories,
    datasets: [{ data: stockData }]
  };

  const lineData = {
    labels: ['Enero', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      { data: [30, 45, 28, 80, 99, 43], strokeWidth: 2 } // Datos de ejemplo de ventas mensuales
    ]
  };

  const pieData = categories.map((category, index) => ({
    name: category,
    population: stockData[index],
    color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  }));

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726'
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Resumen" navigation={navigation}/>
      <ScrollView>
        {/* Gráfico de Barras */}
        <Text style={styles.chartTitle}>Niveles de Inventario por Categoría</Text>
        <BarChart
          data={barData}
          width={screenWidth - 20}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          style={styles.chart}
          />

        {/* Gráfico de Línea */}
        <Text style={styles.chartTitle}>Ventas Mensuales</Text>
        <LineChart
          data={lineData}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          />

        {/* Gráfico de Pastel */}
        <Text style={styles.chartTitle}>Distribución de Inventario por Categoría</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          style={styles.chart}
          />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    marginTop: 44,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 20,
  },
  chartTitle: {
    fontSize: 18,
    color: '#4CAF50',
    marginVertical: 5,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
    paddingLeft:10,
  }
});

export default StatisticsScreen;
