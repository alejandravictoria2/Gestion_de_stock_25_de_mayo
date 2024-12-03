import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../src/api/axios';

const ManageLocationsScreen = ({navigation}) => {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    //Obtenemos los datos del backend
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await API.get('/api/depositos');
      setLocations(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de depósitos');
      console.error(error);
    }
  };

  // Filtrar datos en base a la búsqueda
  const filteredLocations = Array.isArray(locations)
  ? locations.filter((depo) => depo.nombre.toLowerCase().includes(search.toLowerCase()))
  : [];

  return (
    <SafeAreaView style={styles.container}>

      {/* Tabla de inventario */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeader}>Nombre</Text>
          <Text style={styles.tableHeader}>Dirección</Text>
          <Text style={styles.tableHeader}>Acciones</Text>
        </View>

        {filteredLocations.map((depo) => (
          <View key={depo.codigo_deposito} style={styles.tableRow}>
            <Text style={styles.tableCell}>{depo.nombre}</Text>
            <Text style={styles.tableCell}>{depo.direccion}</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => confirmDeleteDepo(depo.codigo_deposito)}>
                <Icon name="delete" size={24} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      {/*Botón flotante para añadir items*/}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddDepo')}
        >
          <Icon name="plus" size={30} color="#FFF"/>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#E8F5E9' 
  },
  tableContainer: {
    paddingHorizontal: 10,
    marginTop:10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#C8E6C9',
    padding: 10,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
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

export default ManageLocationsScreen;
