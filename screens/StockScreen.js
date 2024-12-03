// screens/StockScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenHeader from '../components/ScreenHeader';
import { Picker } from '@react-native-picker/picker';
import API from '../src/api/axios'

const StockScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [deposits, setDeposits] = useState([]); //Lista de depósitos
  const [search, setSearch] = useState(''); // Estado para la búsqueda
  const [selectedDepo, setSelectedDepo] = useState('ALL');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProd, setSelecteProd] = useState(null);

  useEffect(() => {
    //Obtenemos los datos del backend
    fetchInventory();
    fetchDeposits();
  }, []);

  // Obtenemos la lista de depositos
  const fetchDeposits = async () =>{
    try{
      const response = await API.get('/api/depositos');
      setDeposits([{ codigo_deposito: 'ALL', nombre: 'Todos' }, ...response.data]);
    }catch(error){
      Alert.alert('Error', 'No se obtuvo la lista de depositos');
    }
  };

  // Obtenemos la lista de inventario
  const fetchInventory = async () =>{
    try{
      const response = await API.get('/api/stock');
      setData(response.data);
    }catch(error){
      Alert.alert('Error', 'No se pudo cargar el inventario');
    }
  };

  // Confirmación para eliminar un producto
  const confirmDeleteItem = (itemId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteItem(itemId), style: 'destructive' }
      ]
    );
  };

  // Función para eliminar un producto
  const deleteItem = async (itemId) => {
    try{
      const idAsLong = parseInt(itemId, 10);
      console.log(itemId)
        await API.delete(`api/stock/${idAsLong}`);
        setData((prevData) => prevData.filter((item) => item.id !== itemId));
        Alert.alert('Éxito', 'Producto eliminado correctamente');
        fetchInventory(); //Cargamos nuevamente la tabla después de eliminar un producto
    }catch(error){
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  // Filtrar datos en base a la búsqueda
  const filteredData = data.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
    && (selectedDepo === 'ALL' || item.codigo_deposito === selectedDepo)
  );

  // Seleccionar producto para ver detalles
  const handleProductClick=(Producto)=>{
    setSelecteProd(Producto);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
        <ScreenHeader title="Inventario" navigation={navigation}/>
        <Text style={styles.filterLabel}>Filtrar por nombre:</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar en inventario..."
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.filterLabel}>Filtrar por depósito:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedDepo}
          onValueChange={(itemValue) => {
            setSelectedDepo(itemValue)
          }}
          style={styles.picker}
        >
          {deposits.map((deposit) => (
            <Picker.Item
              key={`${deposit.codigo_deposito}-${deposit.nombre}`}
              label={deposit.nombre}
              value={deposit.codigo_deposito}
            />
          ))}
        </Picker>
      </View>

      {/* Tabla de inventario */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeader}>Producto</Text>
          <Text style={styles.tableHeader}>Cantidad</Text>
          <Text style={styles.tableHeader}>Precio</Text>
          <Text style={styles.tableHeader}>Depósito</Text>
          <Text style={styles.tableHeader}>Acciones</Text>
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Lista de productos no disponible</Text>
          </View>
        ):(filteredData.map((item) => (
          <TouchableOpacity key={item.id_producto} onPress={() => handleProductClick(item)}>
            <View key={item.id_producto} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.nombre}</Text>
              <Text
                style={[
                  styles.tableCell,
                  item.cantidad < item.stock_minimo && styles.lowStock,
                ]}
              >
                {item.cantidad}
              </Text>
              <Text style={styles.tableCell}>{item.precio*item.cantidad}</Text>
              <Text style={styles.tableCell}>{item.codigo_deposito}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => confirmDeleteItem(item.id_producto)}>
                  <Icon name="delete" size={24} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )))}
      </ScrollView>

      {/*Modal para ver detalles del producto seleccionado*/}
      {selectedProd && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedProd.nombre}</Text>
              <Text>Cantidad: {selectedProd.cantidad}</Text>
              <Text>Precio unitario: {selectedProd.precio}</Text>
              <Text>Precio total: {selectedProd.precio * selectedProd.cantidad}</Text>
              <Text>Depósito: {selectedProd.codigo_deposito}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {

                  }}
                >
                  <Text style={styles.modalButtonText}>Mover</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {

                  }}
                >
                  <Text style={styles.modalButtonText}>Modificar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false)
                  }}
                >
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/*Botón flotante para añadir items*/}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddItem')}
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
  filterLabel: {
    fontSize: 16,
    marginHorizontal: 10,
    marginTop: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
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
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  lowStock: {
    color: '#D32F2F',
    fontWeight: 'bold',
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

export default StockScreen;