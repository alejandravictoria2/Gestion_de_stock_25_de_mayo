// screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../src/api/axios';
import {useAuth} from '../AuthProvider';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { ActivityIndicator } from 'react-native-web';

const SettingsScreen = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = useState(true); // Suponemos que el usuario es administrador
  const {logout} = useAuth();
  const [isLogginngOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try{
              setIsLoggingOut(true);
              await logout();
              navigation.navigate('Login');
            } catch(error){
              console.error('Error al cerrar sesión', error);
              Alert.alert('Error', 'No se pudo cerrar sesión');
            } finally{
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handleManageRoles = () => {
    if (isAdmin) {
      navigation.navigate('ManageRoles'); // Navega a la pantalla de gestión de roles
    } else {
      Alert.alert('Acceso Denegado', 'No tienes permisos para administrar roles');
    }
  };

  return (
    <View style={styles.container}>
      <View>
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
      <View>
        <TouchableOpacity style={[styles.logOutButton, isLogginngOut && styles.disableButton]}
        onPress={handleLogout}
        disabled={isLogginngOut}
        >
          {isLogginngOut ? (
            <Text style={styles.optionText}>Cerrando sesión...</Text>
          ) : (
            <Text style={styles.optionText}>Cerrar sesión</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  logoutContainer: {
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
  logOutButton:{
    padding: 15,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  disableButton:{
    backgroundColor: "#D32F2F",
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default SettingsScreen;