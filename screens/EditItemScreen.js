import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API from '../src/api/axios'
import { useRoute } from '@react-navigation/native';

const EditItemScreen = ({navigation }) => {
  // Recibir datos del modal en gestión de inventario
  const route = useRoute();
  const {product:itemData} = route.params;
  // Estados para almacenar la información del ítem a actualizar
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('');
  const [min_stock, set_min_stock] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState(''); //Depósito seleccionado
  const [locations, setLocations] = useState([]); //Lista de depósitos

  useEffect(() =>{
    if(itemData){
      setName(itemData.nombre || '');
      setQuantity(itemData.cantidad?.toString() || '');
      setUnit(itemData.unidad || '');
      setType(itemData.tipo || '');
      set_min_stock(itemData.stock_minimo?.toString() || '');
      setPrice(itemData.precio?.toString());
      setLocation(itemData.codigo_deposito || '');
    }
    fetchLocations();
  }, [itemData]);

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

  // Función para manejar la actualización del ítem
  const handleSaveChanges = async () => {
    if (!name || !quantity || !price || location === null || !min_stock || !unit) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try{
      const updateItem = {
        nombre: name,
        cantidad: parseInt(quantity,10),
        unidad: unit,
        tipo: type,
        stock_minimo: parseInt(min_stock,10),
        precio: parseFloat(price),
        codigo_deposito: location,
      };
      
      await API.put(`/api/stock/${itemData.id_producto}`, updateItem);
      Alert.alert('Exito', 'Producto actualizado correctamente');
      navigation.goBack(); //Regresamos a la pantalla anterior
    } catch(error){
      Alert.alert('Error', 'No se pudo actualizar  el producto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del artículo</Text>
      <TextInput
        placeholder="Nombre del Artículo"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>Cantidad</Text>
      <TextInput
        placeholder="Cantidad"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Stock mínimo</Text>
      <TextInput
        placeholder="Stock mínimo"
        value={min_stock}
        onChangeText={set_min_stock}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Unidad</Text>
      <TextInput
        placeholder="Unidad"
        value={unit}
        onChangeText={setUnit}
        style={styles.input}
      />
      <Text style={styles.label}>Tipo</Text>
      <TextInput
        placeholder="Tipo"
        value={type}
        onChangeText={setType}
        style={styles.input}
      />
      <Text style={styles.label}>Precio unitario</Text>
      <TextInput
        placeholder="Precio Unitario"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Depósito</Text>
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

      <TouchableOpacity style={styles.addButton} onPress={handleSaveChanges}>
        <Text style={styles.addButtonText}>Modificar</Text>
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
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  pickerContainer:{
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  picker:{
    height: 50,
    width: '100%',
    borderColor: '#DDD',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default EditItemScreen;
