import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, 
  TouchableOpacity, SafeAreaView, Modal, Alert, ScrollView } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../src/api/axios'

const MovementHistoryScreen = ({navigation}) => {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [filter, setFilter] = useState('Todos');
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchMovimientos();
    fetchDeposits();
  }, []);

  const fetchMovimientos = async () => {
    try{
      const response = await API.get('/api/movimientos');
      if(Array.isArray(response.data)){
        const sortedMovements = response.data.sort(
          (a,b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setMovements(sortedMovements);
        setFilteredMovements(sortedMovements);
      }else{
        setMovements([]);
      }
    }catch(error){
      Alert.alert('Error', 'No se pudo cargar el listado de movimientos');
      setMovements([]);
    }
  }

  // Obtenemos la lista de depositos
  const fetchDeposits = async () =>{
    try{
      const response = await API.get('/api/depositos');
      setDeposits(response.data);
    }catch(error){
      Alert.alert('Error', 'No se obtuvo la lista de depositos');
    }
  };

  // Obtener el nombre del deposito para cada producto
  const getNombreDepositos = (codigo_deposito) => {
    const deposito = deposits.find(dep => dep.codigo_deposito === codigo_deposito);
    return deposito ? deposito.nombre : 'Desconocido';
  }

  // Filtrar movimientos
  const filterMovements = (type) => {
    setFilter(type);
    if (type === 'Todos') {
      setFilteredMovements(movements);
    } else {
      setFilteredMovements(movements.filter((movement) => movement.tipoMovimiento === type));
    }
  };

  //Abrir modal con detalles del movimiento
  const openModal = (movement) =>{
    setSelectedMovement(movement);
    setModalVisible(true);
  }

  //Cerrar modal
  const closeModal = () => {
    setSelectedMovement(null);
    setModalVisible(false);
  }

  const renderMovement = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={styles.movementRow}>
      <View style={styles.iconContainer}>
        <Icon
          name={item.type === 'Entrada' ? 'arrow-down-bold-circle' : 'arrow-up-bold-circle'}
          size={24}
          color={item.type === 'Entrada' ? '#4CAF50' : '#D32F2F'}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.movementType}>{item.tipoMovimiento}</Text>
        <Text style={styles.movementDetails}>
          Desde: {getNombreDepositos(item.desde)}, Hacia: {getNombreDepositos(item.hasta)}
        </Text>
        <Text style={styles.movementDate}>{item.fecha}</Text>
      </View>
    </TouchableOpacity>
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

      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.codigoMovimiento.toString()}
        renderItem={renderMovement}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay movimientos registrados.</Text>}
      />
      {/* Boton flotante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddMovement')}
        >
          <Icon name="plus" size={30} color="#FFF"/>
        </TouchableOpacity>

      {/* Modal para detalles */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles del Movimiento</Text>
            {selectedMovement && (
              <>
                <Text style={styles.modalText}>Tipo: {selectedMovement.tipoMovimiento}</Text>
                <Text style={styles.modalText}>Desde: {getNombreDepositos(selectedMovement.desde)}</Text>
                <Text style={styles.modalText}>Hacia: {getNombreDepositos(selectedMovement.hasta)}</Text>
                <Text style={styles.modalText}>Fecha: {selectedMovement.fecha}</Text>
                <Text style={styles.modalText}>Detalles:</Text>

                {/* Tabla de detalles */}
            <ScrollView style={styles.detalleContainer}>
                <View style={styles.detalleHeaderRow}>
                  <Text style={styles.detalleHeader}>Producto</Text>
                  <Text style={styles.detalleHeader}>Cantidad</Text>
                  <Text style={styles.detalleHeader}>Total</Text>
                </View>
                {(selectedMovement.detalleMovimientos || []).map((detalle) => (
                  <View key={detalle.idDetalle} style={styles.detalleRow}>
                    <Text style={styles.detalleCell}>{detalle.idProducto}</Text>
                    <Text style={styles.detalleCell}>{detalle.cantidad}</Text>
                    <Text style={styles.detalleCell}>{'U$S ' + detalle.precioTotal.toFixed(2)}</Text>
                  </View>
                ))}
              </ScrollView>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});

export default MovementHistoryScreen;

