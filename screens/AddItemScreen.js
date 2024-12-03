import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import API from '../src/api/axios';
import { Picker } from '@react-native-picker/picker';

const AddItemScreen = ({ navigation }) => {
  // Estados para almacenar la información del nuevo ítem
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [min_stock, set_min_stock] = useState('')
  const [max_stock, set_max_stock] = useState('')
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState(''); //Depósito seleccionado
  const [locations, setLocations] = useState([]); //Lista de depósitos

  //Obtenemos los depósitos para cargar en la lista
  useEffect(() =>{
    fetchLocations();
  }, []);

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
  const handleAddItem = async () => {
    if (!name || !quantity || !price || location === null || !min_stock || !max_stock) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try{
      const newItem = {
        nombre: name,
        cantidad: parseInt(quantity,10),
        stock_minimo: parseInt(min_stock,10),
        stock_maximo: parseInt(max_stock,10),
        precio: parseFloat(price),
        codigo_deposito: location,
      };
      
      await API.post('/api/stock', newItem);
      Alert.alert('Exito', 'Producto agregado correctamente');
      navigation.goBack(); //Regresamos a la pantalla anterior
    } catch(error){
      Alert.alert('Error', 'No se pudo agregar  el producto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agregar Nuevo Artículo</Text>
      <TextInput
        placeholder="Nombre del Artículo"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Cantidad"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Stock mínimo"
        value={min_stock}
        onChangeText={set_min_stock}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Stock máximo"
        value={max_stock}
        onChangeText={set_max_stock}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
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

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
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
    fontSize: 20,
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