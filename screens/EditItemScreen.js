import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const EditItemScreen = ({ route, navigation }) => {
  // Obtenemos los datos del ítem a través de la navegación
  const { item } = route.params;

  // Estados para almacenar y actualizar la información del ítem
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [price, setPrice] = useState(item.price.toString());
  const [location, setLocation] = useState(item.location);

  // Función para manejar la actualización del ítem
  const handleSaveChanges = () => {
    if (!name || !quantity || !price || !location) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    // Lógica para actualizar el ítem (puede ser en una base de datos o estado global)
    // Aquí deberías llamar a la API o función para guardar los cambios

    Alert.alert('Éxito', 'Ítem actualizado correctamente');
    navigation.goBack(); // Regresa a la pantalla anterior
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editar Ítem</Text>

      <TextInput
        placeholder="Nombre del Ítem"
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
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Ubicación"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <Button title="Guardar Cambios" onPress={handleSaveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default EditItemScreen;
