import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

export default function Charts() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
      <LineChart
        data={{
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [
            {
              data: [10, 20, 15, 30, 25, 40],
            },
          ],
        }}
        width={Dimensions.get('window').width / 2.2}
        height={200}
        chartConfig={{
          backgroundColor: '#34e89e',
          backgroundGradientFrom: '#34e89e',
          backgroundGradientTo: '#28a745',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={{
          borderRadius: 16,
        }}
      />

      <BarChart
        data={{
          labels: ['Prod A', 'Prod B', 'Prod C', 'Prod D'],
          datasets: [
            {
              data: [150, 200, 100, 175],
            },
          ],
        }}
        width={Dimensions.get('window').width / 2.2}
        height={200}
        chartConfig={{
          backgroundColor: '#34e89e',
          backgroundGradientFrom: '#34e89e',
          backgroundGradientTo: '#28a745',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={{
          borderRadius: 16,
        }}
      />
    </View>
  );
}
