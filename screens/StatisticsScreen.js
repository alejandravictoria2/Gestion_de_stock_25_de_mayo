// screens/StatisticsScreen.js
import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import ScreenHeader from '../components/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import API from 'axios';

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen = ({}) => {
  const navigation = useNavigation();
  const [pieData, setPieData] = useState([]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTopItems();
    });
    return unsubscribe; // Limpiar el listener cuando el componente se desmonte
  }, [navigation]);

  const fetchTopItems = async () => {
    try{
      const response = await API.get('http://192.168.1.102:8080/api/stock/top5');
      const data = response.data;

      const formattedData = data.map(item =>({
        name: `${item.nombre} - (U$D ${(item.precio*item.cantidad).toFixed(2)})`,
        population: item.precio * item.cantidad,
        color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 15
      }));

      setPieData(formattedData);
    }catch(error){
      console.error('Error al obtener los datos de los artículos:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
      } else if (error.request) {
        console.error('No se recibió respuesta:', error.request);
      } else {
        console.error('Error desconocido:', error.message);
      }
    }
  };

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Gráfico de Pastel */}
        <Text style={styles.chartTitle}>Artículos más valuados</Text>
        <View style={styles.centerContainer}>
          <PieChart
            data={pieData}
            width={screenWidth - 20}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            style={styles.chart}
            hasLegend={false}
            />
        
          {/* Legendas */}
          <View style={styles.legendContainer}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
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
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
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
  },
  centerContainer: {
    alignItems: 'center', // Centra el gráfico y leyendas horizontalmente
    marginBottom: 20,
  },
  legendContainer:{
    marginTop: 10,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 15,
    color: '#4CAF50',
  }
});

export default StatisticsScreen;
