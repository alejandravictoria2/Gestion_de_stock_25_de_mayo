// screens/ManageSuppliersScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../src/api/axios';

const ManageSuppliersScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(()=>{
    fetchSuppliers();
  },[]);

  const fetchSuppliers = async () => {
    try{
      const response = await API.get('/api/proveedores');
      if(Array.isArray(response.data)){
        setSuppliers(response.data);
      }else{
        setSuppliers([]);
      }
    }catch(error){
      Alert.alert('Error', 'No se pudo cargar el listado de proveedores');
      setSuppliers([]);
    }
  };

  // Confirmación para eliminar un producto
  const confirmDeleteSupplier = (cuit) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este proveedor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteSupplier(cuit), style: 'destructive' }
      ]
    );
  };

  // Función para eliminar un producto
  const deleteSupplier = async (cuit) => {
    try{
        await API.delete(`api/proveedores/${cuit}`);
        setSuppliers((prevData) => prevData.filter((proveedor) => proveedor.cuitProveedor !== cuit));
        Alert.alert('Éxito', 'Proveedor eliminado correctamente');
        fetchSuppliers(); //Cargamos nuevamente la tabla después de eliminar un producto
    }catch(error){
      Alert.alert('Error', 'No se pudo eliminar el proveedor');
    }
  };

  const filteredData = Array.isArray(suppliers) ? suppliers.filter((supplier) =>
    supplier.nombre.toLowerCase().includes((search || '').toLowerCase())
  ) : [];

  const handleSupplierClick=(supplier)=>{
    setSelectedSupplier(supplier);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar proveedor"
        value={search}
        onChangeText={setSearch}
      />
      {/* Tabla de inventario */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeader}>Cuit</Text>
          <Text style={styles.tableHeader}>Nombre</Text>
          <Text style={styles.tableHeader}>Direccion</Text>
          <Text style={styles.tableHeader}>Acciones</Text>
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay proveedores disponibles</Text>
          </View>
        ):(
          filteredData.map((supplier) => (
            <TouchableOpacity key={supplier.cuitProveedor} onPress={() => handleSupplierClick(supplier)}>
              <View key={supplier.cuitProveedor} style={styles.tableRow}>
                <Text style={styles.tableCell}>{supplier.cuitProveedor}</Text>
                <Text style={styles.tableCell}>{supplier.nombre}</Text>
                <Text style={styles.tableCell}>{supplier.direccion}</Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => confirmDeleteSupplier(supplier.cuitProveedor)}>
                    <Icon name="delete" size={24} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
        )))}
      </ScrollView>

      {/*Modal para detalles*/}
      {selectedSupplier && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedSupplier.nombre}</Text>
                <Text>Legajo: {selectedSupplier.cuit}</Text>
                <Text>Nombre: {selectedSupplier.nombre}</Text>
                <Text>Apellido: {selectedSupplier.direccion}</Text>
                <View style={styles.modalButtons}>
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

      {/*Botón flotante*/}
      <TouchableOpacity
      style={styles.floatingButton}
      onPress={() => navigation.navigate('')}
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
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 20,
    textAlign: 'center',
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

export default ManageSuppliersScreen;
