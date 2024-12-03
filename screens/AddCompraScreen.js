import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import API from '../src/api/axios';
import { Picker } from '@react-native-picker/picker';

const AddCompraScreen = ({ navigation }) => {
    // Estados para almacenar la información del nuevo ítem
    const [fecha, setFecha] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [location, setLocation] = useState(''); //Depósito seleccionado
    const [locations, setLocations] = useState([]); //Lista de depósitos
  
    //Obtenemos los depósitos para cargar en la lista
    useEffect(() =>{
      fetchLocations();
      fetchProveedor();
    }, []);
  
    const fetchProveedor = async () =>{
      try{
        const response = await API.get('/api/proveedores');
        if(Array.isArray(response.data)){
          setProveedores(response.data);
        }
        else{
          console.error('La respuesta no es un array:', response.data);
          Alert.alert('Error', 'La respuesta del servidor no es válida');
        }
      }catch(error){
        Alert.alert('Error', 'No se encontraron proveedores');
        console.error(error);
      }
    };

    const fetchLocations = async () =>{
      try{
        const response = await API.get('/api/depositos');
        if(Array.isArray(response.data)){
          setLocations(response.data);
        }
        else{
          console.error('La respuesta no es un array:', response.data);
          Alert.alert('Error', 'La respuesta del servidor no es válida');
        }
      }catch(error){
        Alert.alert('Error', 'No se pudieron cargar los depósitos');
        console.error(error);
      }
    };
  
    // Función para manejar el envío del formulario
    const handleAddCompra = async () => {
      if (!fecha || location === null || proveedor === null) {
        Alert.alert('Error', 'Por favor completa todos los campos.');
        return;
      }
  
      try{
        const newItem = {
          cuit_proveedor: proveedor,
          fecha: Date.now(),
          codigo_deposito: location,
        };
        
        await API.post('/api/comprass', newItem);
        Alert.alert('Exito', 'Compra registrada correctamente');
        navigation.goBack(); //Regresamos a la pantalla anterior
      } catch(error){
        Alert.alert('Error', 'No se pudo registrar la compra');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Regsitrar Compra</Text>
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={proveedor}
            onValueChange={(itemValue) => {
              setLocation(itemValue);
            }}
            style={styles.picker}
            >
              <Picker.Item label="Selecciona un proveedor" value=""/>
              {proveedores.map((pro) => (
                <Picker.Item
                  key={`${pro.cuit_proveedor}-${pro.nombre}`}
                  label={pro.nombre}
                  value={pro.cuit_proveedor}/>
              ))}
            </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={location}
            onValueChange={(itemValue) => {
              setLocation(itemValue);
            }}
            style={styles.picker}
            >
              <Picker.Item label="Selecciona un depósito" value=""/>
              {locations.map((loc) => (
                <Picker.Item
                  key={`${loc.codigo_deposito}-${loc.nombre}`}
                  label={loc.nombre}
                  value={loc.codigo_deposito}/>
              ))}
            </Picker>
        </View>
  
        <TouchableOpacity style={styles.addButton} onPress={handleAddCompra}>
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
  
  export default AddCompraScreen;