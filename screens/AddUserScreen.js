import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import API from '../src/api/axios';
import { Picker } from '@react-native-picker/picker';

const AddItemScreen = ({ navigation }) => {
  // Estados para almacenar la información del nuevo ítem
  const [legajo, setLegajo] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('')
  const [pass, setPass] = useState('');
  const [dni, setDni] = useState('')
  const [role, setRole] = useState('');

  // Función para manejar el envío del formulario
  const handleAddUser = async () => {
    if (!name || !legajo || !lastName || !pass || !dni || !role) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try{
      const newUser = {
        legajo: legajo,
        nombre: name,
        apellido: lastName,
        contrasenia: pass,
        dni: dni,
        cargo: role,
      };
      
      await API.post('/api/usuarios', newUser);
      Alert.alert('Exito', 'Usuario agregado correctamente');
    } catch(error){
      Alert.alert('Error', 'No se pudo crear el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agregar Usuario</Text>

      <TextInput
        placeholder="Legajo"
        value={legajo}
        onChangeText={setLegajo}
        style={styles.input}
      />
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="DNI"
        value={dni}
        onChangeText={setDni}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Cargo"
        value={role}
        onChangeText={setRole}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        value={pass}
        onChangeText={setPass}
        style={styles.input}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
        <Text style={styles.addButtonText}>AGREGAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  pickerContainer:{
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  picker:{
    height: 50,
    width: '100%',
    borderColor: '#DDD',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddItemScreen;