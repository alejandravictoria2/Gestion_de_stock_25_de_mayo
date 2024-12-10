import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  FlatList, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import API from '../src/api/axios';
import { Picker } from '@react-native-picker/picker';

const AddItemScreen = ({ navigation }) => {
  // Estados para almacenar la información del nuevo ítem
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [min_stock, set_min_stock] = useState('');
  const [location, setLocation] = useState(''); //Depósito seleccionado
  const [locations, setLocations] = useState([]); //Lista de depósitos
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  //Obtenemos los depósitos para cargar en la lista
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setFilteredSuggestions([]);
      return;
    }
    try {
      const response = await API.get(`/api/stock/buscar?nombre=${query}`)
      setFilteredSuggestions(response.data);
    } catch (error) {
      console.error('Error al obtener el listado de sugerencias', error);
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await API.get('/api/depositos');
      if (Array.isArray(response.data)) {
        setLocations(response.data);
      }
      else {
        console.error('La respuesta no es un array:', response.data);
        Alert.alert('Error', 'La respuesta del servidor no es válida');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los depósitos');
      console.error(error);
    }
  };

  const filterSuggestions = (query, data) => {
    const filtered = data.filter((item) =>
      item.nombre.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleNameChange = (text) => {
    setName(text);
    fetchSuggestions(text);
  };

  const handleSuggestionSelect = (item) => {
    setName(item.nombre);
    setQuantity(item.cantidad.toString());
    setUnit(item.unidad);
    setType(item.tipo);
    setPrice(item.precio.toString());
    setLocation(item.codigo_deposito.toString());
    set_min_stock(item.stock_minimo.toString());
    setFilteredSuggestions([]); // Oculta las sugerencias al seleccionar una
  }

  // Función para manejar el envío del formulario
  const handleAddItem = async () => {
    if (!name || !quantity || !price || location === null || !min_stock || !unit) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const response = await API.get(`/api/stock?nombre=${name}`);
      const existingItems = response.data;

      if (existingItems.length > 0) {
        // Buscar si el item existente ya está en algun depósito
        const existingItemInlocation = existingItems.find(item => String(item.codigo_deposito) === String(location));

        if (existingItemInlocation) {
          // Si el artículo ya existe en el mismo depósito, se actualiza la cantidad

          const updatedItem = {
            ...existingItemInlocation,
            cantidad: existingItemInlocation.cantidad + parseInt(quantity, 10),
          };

          await API.put(`/api/stock/${existingItemInlocation.id_producto}`, updatedItem);
          Alert.alert('Éxito', 'Producto actualizado correctamente');
        } else {
          // Si el artículo no existe en el mismo depósito, lo añadimos como nuevo en este depósito
          const newItem = {
            nombre: name,
            cantidad: parseInt(quantity, 10),
            unidad: unit,
            tipo: type,
            stock_minimo: parseInt(min_stock, 10),
            precio: parseFloat(price),
            codigo_deposito: location,
          };

          await API.post('/api/stock', newItem);
          Alert.alert('Éxito', 'Producto agregado correctamente');
        }
      }
      else {
        // Si el artículo no existe en la base de datos, lo añadimos como nuevo
        const newItem = {
          nombre: name,
          cantidad: parseInt(quantity, 10),
          unidad: unit,
          tipo: type,
          stock_minimo: parseInt(min_stock, 10),
          precio: parseFloat(price),
          codigo_deposito: location,
        };

        await API.post('/api/stock', newItem);
        Alert.alert('Exito', 'Producto agregado correctamente');
      }
      navigation.goBack(); //Regresamos a la pantalla anterior
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar  el producto');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.label}>Nombre del artículo</Text>
          <TextInput
            placeholder="Nombre del Artículo"
            value={name}
            onChangeText={handleNameChange}
            style={styles.input}
          />
          {filteredSuggestions.length > 0 && (
            <View style={{height:200}}>
            <FlatList
              data={filteredSuggestions}
              keyExtractor={(item) => item.id_producto.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(item)}>
                  <Text style={styles.suggestionText}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
            </View>
          )}
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
              <Picker.Item label="Selecciona un depósito" value="" />
              {locations.map((loc) => (
                <Picker.Item
                  key={`${loc.codigo_deposito}-${loc.nombre}`}
                  label={loc.nombre}
                  value={loc.codigo_deposito} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Text style={styles.addButtonText}>AGREGAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 16,
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
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  suggestionText: {
    fontSize: 15,
    color: '#111827',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  picker: {
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

export default AddItemScreen;