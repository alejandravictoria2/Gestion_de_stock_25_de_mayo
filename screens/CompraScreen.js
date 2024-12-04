// screens/CompraScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenHeader from '../components/ScreenHeader';
import API from '../src/api/axios';

const CompraScreen = ({ navigation }) => {

  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalleCompra, setDetalleCompra] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    //Obtenemos los datos del backend
    fetchCompras();
    fetchDeposits();
    fetchProveedor();
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

  // Obtenemos la lista de depositos
  const fetchDeposits = async () =>{
    try{
      const response = await API.get('/api/depositos');
      setDeposits(response.data);
    }catch(error){
      Alert.alert('Error', 'No se obtuvo la lista de depositos');
    }
  };

  const fetchProveedor = async () => {
    try{
        const response = await API.get('/api/proveedores');
        setProveedores(response.data);
    }catch(error){
      Alert.alert('Error','No se obtuvo la lista de proveedores');
    }
  }

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
        setData((prevData) => prevData.filter((compra) => compra.codigoCompra !== compraId));
        Alert.alert('Éxito', 'Compra eliminada correctamente');
        fetchCompras(); //Cargamos nuevamente la tabla después de eliminar la compra
    }catch(error){
      Alert.alert('Error', 'No se pudo eliminar la compra');
    }
  };

  // Mostrar detalle de compras
  const mostrarCompraDetails = (compraID) => {
    const compra = data.find(compra => compra.codigoCompra == compraID);
    if(compra){
      setDetalleCompra(compra);
      setModalVisible(true);
    }
  };

  // Obtener el nombre del deposito para cada producto
  const getNombreDepositos = (codigo_deposito) => {
    const deposito = deposits.find(dep => dep.codigo_deposito === codigo_deposito);
    return deposito ? deposito.nombre : 'Desconocido';
  }

  const getNombreProveedores = (cuitProveedor) => {
    const proveedor = proveedores.find(prov => prov.cuitProveedor === cuitProveedor);
    return proveedor ? proveedor.nombre : 'Desconocido';
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Compras" navigation={navigation}/>

      {/* Tabla de compras */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeader}>Compra</Text>
          <Text style={styles.tableHeader}>Fecha</Text>
          <Text style={styles.tableHeader}>Proveedor</Text>
          <Text style={styles.tableHeader}>Depósito</Text>
          <Text style={styles.tableHeader}>Acciones</Text>
        </View>

        {data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Lista de compras no disponible</Text>
          </View>
        ):(data.map((data) => (
          <TouchableOpacity key={data.codigoCompra} onPress={() => mostrarCompraDetails(data.codigoCompra, data)}>
            <View key={data.codigoCompra} style={styles.tableRow}>
              <Text style={styles.tableCell}>{data.codigoCompra}</Text>
              <Text style={styles.tableCell}>{data.fechaCompra}</Text>
              <Text style={styles.tableCell}>{getNombreProveedores(data.cuitProveedor)}</Text>
              <Text style={styles.tableCell}>{getNombreDepositos(data.codigoDeposito)}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => confirmDeleteCompra(data.codigoCompra)}>
                  <Icon name="delete" size={24} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )))}
      </ScrollView>
      
      {/*Botón flotante para añadir items*/}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddCompra')}
        >
          <Icon name="plus" size={30} color="#FFF"/>
        </TouchableOpacity>

        {/* Modal para mostrar detalles de la compra */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles de la Compra</Text>
            <Text style={styles.modalText}>Código de Compra: {detalleCompra.codigoCompra}</Text>
            <Text style={styles.modalText}>Fecha: {detalleCompra.fechaCompra}</Text>
            <Text style={styles.modalText}>Proveedor: {getNombreProveedores(detalleCompra.cuitProveedor)}</Text>
            <Text style={styles.modalText}>Depósito: {getNombreDepositos(detalleCompra.codigoDeposito)}</Text>
            <Text style={styles.modalText}>Total: {detalleCompra.totalCompra}</Text>

            {/* Tabla de detalles */}
            <ScrollView style={styles.detalleContainer}>
                <View style={styles.detalleHeaderRow}>
                  <Text style={styles.detalleHeader}>Nombre</Text>
                  <Text style={styles.detalleHeader}>Cantidad</Text>
                  <Text style={styles.detalleHeader}>Unidad</Text>
                  <Text style={styles.detalleHeader}>Precio</Text>
                </View>
                {(detalleCompra.detalleCompras || []).map((detalle) => (
                  <View key={detalle.idDetalle} style={styles.detalleRow}>
                    <Text style={styles.detalleCell}>{detalle.nombre}</Text>
                    <Text style={styles.detalleCell}>{detalle.cantidad}</Text>
                    <Text style={styles.detalleCell}>{detalle.unidad}</Text>
                    <Text style={styles.detalleCell}>{'U$S ' + detalle.precio.toFixed(2)*detalle.cantidad}</Text>
                  </View>
                ))}
              </ScrollView>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    marginTop: 44,
  },
  tableContainer: {
    paddingHorizontal: 10,
    marginTop:10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
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
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#4CAF50',
  },
  modalText: {
    fontSize: 14,
    marginVertical: 5,
    color: '#555',
  },
  detalleContainer: {
    marginTop: 15,
    maxHeight: 200,
  },
  detalleHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#81C784',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  detalleHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  detalleCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default CompraScreen;