// screens/ManageUsersScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../src/api/axios';

const ManageUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers(); //Obtenemos los datos del backend
  }, []);

  const fetchUsers = async () =>{
    try{
      const response = await API.get('/api/usuarios');
      if(Array.isArray(response.data)){
        setUsers(response.data);
      }else{
        setUsers([]);
      }
    }catch(error){
      Alert.alert('Error', 'No se pudo cargar el listado de usuarios');
      setUsers([]);
    }
  };

  // Confirmación para eliminar un producto
  const confirmDeleteUser = (userId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteUser(userId), style: 'destructive' }
      ]
    );
  };

  // Función para eliminar un producto
  const deleteUser = async (userId) => {
    try{
      const idAsLong = parseInt(userId, 10);
        await API.delete(`api/usuarios/${idAsLong}`);
        setUsers((prevData) => prevData.filter((user) => user.legajo !== userId));
        Alert.alert('Éxito', 'Usuario eliminado correctamente');
        fetchUsers(); //Cargamos nuevamente la tabla después de eliminar un producto
    }catch(error){
      Alert.alert('Error', 'No se pudo eliminar el usuario');
    }
  };

  // Filtrar datos en base a la búsqueda
  const filteredData = Array.isArray(users) ? users.filter((user) =>
    user.nombre.toLowerCase().includes((search || '').toLowerCase())
  ) : [];

  const handleUsersClick=(Usuario)=>{
    setSelectedUser(Usuario);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar usuario"
        value={search}
        onChangeText={setSearch}
      />
      {/* Tabla de inventario */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeader}>Legajo</Text>
          <Text style={styles.tableHeader}>Nombre</Text>
          <Text style={styles.tableHeader}>Apellido</Text>
          <Text style={styles.tableHeader}>DNI</Text>
          <Text style={styles.tableHeader}>Cargo</Text>
          <Text style={styles.tableHeader}>Acciones</Text>
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay usuarios disponibles</Text>
          </View>
        ):(
          filteredData.map((user) => (
            <TouchableOpacity key={user.legajo} onPress={() => handleUsersClick(user)}>
              <View key={user.legajo} style={styles.tableRow}>
                <Text style={styles.tableCell}>{user.legajo}</Text>
                <Text style={styles.tableCell}>{user.nombre}</Text>
                <Text style={styles.tableCell}>{user.apellido}</Text>
                <Text style={styles.tableCell}>{user.dni}</Text>
                <Text style={styles.tableCell}>{user.cargo}</Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => confirmDeleteUser(user.legajo)}>
                    <Icon name="delete" size={24} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
        )))}
      </ScrollView>

      {/*Modal para detalles*/}
      {selectedUser && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedUser.nombre + ' ' + selectedUser.apellido}</Text>
                <Text>Legajo: {selectedUser.legajo}</Text>
                <Text>Nombre: {selectedUser.nombre}</Text>
                <Text>Apellido: {selectedUser.apellido}</Text>
                <Text>DNI: {selectedUser.dni}</Text>
                <Text>Cargo: {selectedUser.cargo}</Text>
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
      onPress={() => navigation.navigate('AddUser')}
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

export default ManageUsersScreen;