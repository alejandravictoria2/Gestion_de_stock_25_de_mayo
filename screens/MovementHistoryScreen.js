import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../src/api/axios'

const MovementHistoryScreen = ({navigation}) => {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    const sampleMovements = [
      { id: '1', type: 'Entrada', item: 'Transformador', quantity: 10, date: '2024-10-28 10:00 AM' },
      { id: '2', type: 'Salida', item: 'Cable', quantity: 5, date: '2024-10-29 02:30 PM' },
      { id: '3', type: 'Entrada', item: 'Medidor', quantity: 8, date: '2024-10-30 11:15 AM' },
      { id: '4', type: 'Salida', item: 'Fusible', quantity: 3, date: '2024-10-31 09:45 AM' },
    ];

    const sortedMovements = sampleMovements.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setMovements(sortedMovements);
    setFilteredMovements(sortedMovements);
  }, []);

  const fetchMovimientos = async () =>{
    try{
      const response = await API.get('/api/movimientos');
      if(Array.isArray(response.data)){
        setMovements(response.data)
      }else{
        setMovements([]);
      }
    }catch(error){
      Alert.alert('Error', 'No se pudo cargar el listado de movimientos');
      setMovements([]);
    }
  }
  // Filtrar movimientos
  const filterMovements = (type) => {
    setFilter(type);
    if (type === 'Todos') {
      setFilteredMovements(movements);
    } else {
      setFilteredMovements(movements.filter((movement) => movement.type === type));
    }
  };

  const renderMovement = ({ item }) => (
    <View style={styles.movementRow}>
      <View style={styles.iconContainer}>
        <Icon
          name={item.type === 'Entrada' ? 'arrow-down-bold-circle' : 'arrow-up-bold-circle'}
          size={24}
          color={item.type === 'Entrada' ? '#4CAF50' : '#D32F2F'}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.movementType}>{item.type}</Text>
        <Text style={styles.movementDetails}>{item.item}</Text>
        <Text style={styles.movementDetails}>Cantidad: {item.quantity}</Text>
        <Text style={styles.movementDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Historial de Movimientos" navigation={navigation}/>
      {/* Filtros */}
      <View style={styles.filterContainer}>
        {['Todos', 'Entrada', 'Salida'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.activeFilter]}
            onPress={() => filterMovements(type)}
          >
            <Text style={styles.filterText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList style = {styles.flastList}
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        renderItem={renderMovement}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay movimientos registrados.</Text>}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddMovement')}
        >
          <Icon name="plus" size={30} color="#FFF"/>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    marginTop: 44,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  movementRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  movementType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  movementDetails: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  movementDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  flastList:{
    padding: 20,
  },
  floatingButton:{
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius:50,
    width:60,
    height:60,
    alignItems: 'center',
    justifyContent:'center',
    elevation: 5,
  },
});

export default MovementHistoryScreen;

