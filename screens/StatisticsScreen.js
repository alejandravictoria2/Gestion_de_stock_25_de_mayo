// screens/StatisticsScreen.js
import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import ScreenHeader from '../components/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import API from '../src/api/axios';

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen = ({}) => {
  const navigation = useNavigation();
  const [pieData, setPieData] = useState([]);
  const [pieDataUser, setPieDataUser] = useState([]);
  const [barData, setBarData] = useState([]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTopItems();
      fetchTopUserMovements();
      fetchLast30Days();
    });
    return unsubscribe; // Limpiar el listener cuando el componente se desmonte
  }, [navigation]);

  const fetchTopItems = async () => {
    try{
      const response = await API.get('/api/stock/top5');
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

  const fetchTopUserMovements = async () => {
    try{
      const response = await API.get('/api/movimientos/top-users');
      const data = response.data;

      const formattedData = data.map((item, index) =>({
        name: `Legajo: ${item.legajo} (${item.totalMovimientos})`,
        population: item.totalMovimientos,
        color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      }));

      setPieDataUser(formattedData);
    }catch(error){
      Alert.alert('Error', 'Error al obtener usuarios con más movimientos');
    }
  };

  const fetchLast30Days = async () => {
    try {
      const response = await API.get('/api/movimientos/by-day');
      const data = response.data;
  
      // Validar datos para asegurarnos de que las etiquetas y valores sean válidos
      if (Array.isArray(data) && data.length > 0) {
        const labels = data.map(item => item.fecha || 'Sin fecha');
        const values = data.map(item => item.totalMovimientos || 0);
  
        // Asegurarnos de que no haya valores NaN
        if (labels.every(label => label) && values.every(value => !isNaN(value))) {
          setBarData({
            labels: labels,
            datasets: [
              {
                data: values,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Color de las barras
                strokeWidth: 2,
              },
            ],
          });
        } else {
          console.warn('Datos inválidos en el conjunto de movimientos diarios.');
          setBarData({ labels: [], datasets: [] }); // Manejo en caso de datos inválidos
        }
      } else {
        console.warn('No se encontraron datos para los movimientos diarios.');
        setBarData({ labels: [], datasets: [] }); // Manejo en caso de datos vacíos
      }
    } catch (error) {
      console.error('Error al obtener movimientos diarios:', error);
      setBarData({ labels: [], datasets: [] }); // Manejo en caso de error en la API
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
        <View style={styles.chartWrapper}>
          <PieChart
            data={pieData}
            width={screenWidth}
            height={220}
            innerRadius={50}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            style={styles.chart}
            hasLegend={false}
            />
        </View>
          {/* Leyendas */}
          <View style={styles.legendContainer}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Gráfico de Pastel */}
        <Text style={styles.chartTitle}>Usuarios con más movimientos</Text>
        <PieChart
          data={pieDataUser}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          style={styles.chart}
        />
        {/* Gráfico de barras */}
        <Text style={styles.chartTitle}>Movimientos en los últimos 30 días</Text>
        {barData.labels && barData.labels.length > 0 && barData.datasets && barData.datasets[0].data.length > 0 ? (
          <BarChart
            data={barData}
            width={screenWidth - 20}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={30} // Rota las etiquetas del eje X
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noDataText}>No hay datos suficientes para mostrar el gráfico.</Text>
        )}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 5,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 10,
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  legendContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
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
  },
  noDataText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default StatisticsScreen;