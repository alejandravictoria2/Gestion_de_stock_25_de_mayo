// screens/StockScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Switch, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenHeader from '../components/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import API from '../src/api/axios'

const StockScreen = ({  }) => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [deposits, setDeposits] = useState([]); //Lista de depósitos
  const [search, setSearch] = useState(''); // Estado para la búsqueda
  const [selectedDepo, setSelectedDepo] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [lowStock, setLowStock] = useState(false);
  const [types, setTypes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProd, setSelecteProd] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchInventory();
      fetchDeposits();
      fetchProductTypes();
    });
    return unsubscribe; // Limpiar el listener cuando el componente se desmonte
  }, [navigation]);

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

  // Obtener la lista de tipo de productos
  const fetchProductTypes = async () => {
    try{
      const response = await API.get('/api/stock/types');
      setTypes([{tipo: 'ALL', nombre: 'Todos'}, ...response.data]);
    }catch(error){
      Alert.alert('Error', 'No se pudo obtener la lista de tipo de productos')
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
    && (selectedType === 'ALL' || item.tipo === selectedType)
    && (!lowStock || item.cantidad <= item.stock_minimo)
  );

  // Seleccionar producto para ver detalles
  const handleProductClick=(Producto)=>{
    setSelecteProd(Producto);
    setModalVisible(true);
  };

  // Navegar a EditItem con el producto seleccionado
  const navigateToEdit= () => {
    navigation.navigate('EditItem', {product: selectedProd});
    setModalVisible(false);
  };

  const navigateToMove = () => {
    navigation.navigate('AddMovement', {product: selectedProd});
    setModalVisible(false);
  };

  // Obtener el nombre del deposito para cada producto
  const getNombreDepositos = (codigo_deposito) => {
    const deposito = deposits.find(dep => dep.codigo_deposito === codigo_deposito);
    return deposito ? deposito.nombre : 'Desconocido';
  }

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
      
      <Text style={styles.filterLabel}>Filtrar por tipo de artículo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => {
            setSelectedType(itemValue)
          }}
          style={styles.picker}
        >
          {types.map((type) => (
            <Picker.Item
              key={type.tipo}
              label={type.nombre}
              value={type.tipo}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.filterLabel}>Filtrar por bajo stock:</Text>
        <Switch
          value={lowStock}
          onValueChange={setLowStock}
          style={styles.switch}
        />
      </View>

      {/* Tabla de inventario */}
      <View style={styles.tableHeaderRow}>
       <Text style={styles.tableHeader}>Producto</Text>
        <Text style={styles.tableHeader}>Cantidad</Text>
        <Text style={styles.tableHeader}>Tipo</Text>
        <Text style={styles.tableHeader}>Precio</Text>
        <Text style={styles.tableHeader}>Depósito</Text>
      </View>
      <ScrollView style={styles.tableContainer}>
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
                  item.cantidad <= item.stock_minimo && styles.lowStock,
                ]}
              >
                {item.cantidad} {item.unidad}
              </Text>
              <Text style={styles.tableCell}>{item.tipo}</Text>
              <Text style={styles.tableCell}>{'U$S ' + item.precio*item.cantidad}</Text>
              <Text style={styles.tableCell}>{getNombreDepositos(item.codigo_deposito)}</Text>
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
              <Text style={styles.modalDetail}>Cantidad: {selectedProd.cantidad} {selectedProd.unidad}</Text>
              <Text style={styles.modalDetail}>Precio unitario: U$S {selectedProd.precio}</Text>
              <Text style={styles.modalDetail}>Precio total: U$S {selectedProd.precio * selectedProd.cantidad}</Text>
              <Text style={styles.modalDetail}>Depósito: {getNombreDepositos(selectedProd.codigo_deposito)}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={navigateToMove}>
                  <Text style={styles.modalButtonText}>Mover</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={navigateToEdit}>
                  <Text style={styles.modalButtonText}>Modificar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => {setModalVisible(false)}}>
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
    marginTop: 5,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 15,
    margin: 5,
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
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
  switchContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch:{
    transform: [{ scale: 1 }],
  },
  tableContainer: {
    paddingHorizontal: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    marginHorizontal:10,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#4CAF50',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalDetail:{
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  modalButtons:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11,
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