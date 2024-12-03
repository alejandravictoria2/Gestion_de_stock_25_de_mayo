// screens/CompraScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenHeader from '../components/ScreenHeader';
import API from '../src/api/axios';

const CompraScreen = ({ navigation }) => {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    //Obtenemos los datos del backend
    fetchCompras();
  }, []);

  const fetchCompras = async () =>{
    try{
      const response = await API.get('/api/compras');
      if(Array.isArray(response.data)){
        setData(response.data);
      }else{
        setData([]);
      }
    }catch(error){
      Alert.alert('Error', 'No se pudo cargar el listado de compras');
      setData([]);
    }
  };

  // Confirmación para eliminar un producto
  const confirmDeleteCompra = (compraId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteCompras(compraId), style: 'destructive' }
      ]
    );
  };

  // Función para eliminar un producto
  const deleteCompras = async (compraId) => {
    try{
      const idAsLong = parseInt(compraId, 10);
        await API.delete(`api/compras/${idAsLong}`);
        setData((prevData) => prevData.filter((data) => compra.codigoCompra !== compraId));
        Alert.alert('Éxito', 'Compra eliminada correctamente');
        fetchCompras(); //Cargamos nuevamente la tabla después de eliminar la compra
    }catch(error){
      Alert.alert('Error', 'No se pudo eliminar la compra');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Compras" navigation={navigation}/>

      {/* Tabla de inventario */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeader}>Compra</Text>
          <Text style={styles.tableHeader}>Proveedor</Text>
          <Text style={styles.tableHeader}>Fecha</Text>
          <Text style={styles.tableHeader}>Depósito</Text>
          <Text style={styles.tableHeader}>Acciones</Text>
        </View>

        {data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Lista de compras no disponible</Text>
          </View>
        ):(data.map((data) => (
          <View key={data.codigoCompra} style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.codigoCompra}</Text>
            <Text style={styles.tableCell}>{data.cuitProveedor}</Text>
            <Text style={styles.tableCell}>{data.fechaCompra}</Text>
            <Text style={styles.tableCell}>{data.codigoDeposito}</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => confirmDeleteCompra(data.codigoCompra)}>
                <Icon name="delete" size={24} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          </View>
        )))}
      </ScrollView>
      
      {/*Botón flotante para añadir items*/}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddCompra')}
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
  searchInput: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    margin: 10,
    fontSize: 16,
    color: '#333',
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
  emptyContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'Italic',
  },
});

export default CompraScreen;