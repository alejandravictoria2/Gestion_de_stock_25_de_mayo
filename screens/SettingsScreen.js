// screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = useState(true); // Suponemos que el usuario es administrador

  const handleManageRoles = () => {
    if (isAdmin) {
      navigation.navigate('ManageRoles'); // Navega a la pantalla de gestión de roles
    } else {
      Alert.alert('Acceso Denegado', 'No tienes permisos para administrar roles');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ManageUsers')}>
        <Text style={styles.optionText}>Gestionar Usuarios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ManageLocations')}>
        <Text style={styles.optionText}>Gestionar Depositos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ManageSuppliers')}>
        <Text style={styles.optionText}>Gestion de proveedores</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  backButton:{
    marginBottom: 20,
  },
  backButtonText:{
    color: '#4CAF50',
    fontSize: 16,
  },
  title:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  optionButton:{
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default SettingsScreen;