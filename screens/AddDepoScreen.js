import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import API from '../src/api/axios';

const AddDepoScreen = ({navigation}) => {
    const [nombre, setNombre] = useState('');
    const [location, setLocation] = useState('');

    const handleAddDepo = async () => {
        if (!nombre || !location) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }

        try{
            const newDepo = {
                nombre : nombre,
                direccion: location,
            };

            await API.post('/api/depositos', newDepo);
            Alert.alert('Exito', 'Producto agregado correctamente');
        }catch(error){
            Alert.alert('Error', 'No se pudo agregar  el depósito');
        }
    };
    
    return(
        <View style={styles.container}>
            <Text style={styles.header}>Agregar Depósito</Text>
    
            <TextInput
            placeholder="Nombre del depósito"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            />
            <TextInput
            placeholder="Dirección"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddDepo}>
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

export default AddDepoScreen;