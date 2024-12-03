// screens/ManageSuppliersScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';

const ManageSuppliersScreen = () => {
  const [suppliers, setSuppliers] = useState([
    { id: '1', name: 'Proveedor A', contact: '123456789', products: 'Transformadores, Cables' },
    { id: '2', name: 'Proveedor B', contact: '987654321', products: 'Medidores, Fusibles' }
  ]);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierContact, setNewSupplierContact] = useState('');
  const [newSupplierProducts, setNewSupplierProducts] = useState('');

  const handleAddSupplier = () => {
    if (!newSupplierName || !newSupplierContact || !newSupplierProducts) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    const newSupplier = {
      id: `${suppliers.length + 1}`,
      name: newSupplierName,
      contact: newSupplierContact,
      products: newSupplierProducts
    };
    setSuppliers([...suppliers, newSupplier]);
    setNewSupplierName('');
    setNewSupplierContact('');
    setNewSupplierProducts('');
    Alert.alert('Éxito', 'Proveedor agregado.');
  };

  const handleDeleteSupplier = (id) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    Alert.alert('Eliminado', 'Proveedor eliminado.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de Proveedores</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nombre del Proveedor"
          value={newSupplierName}
          onChangeText={setNewSupplierName}
          style={styles.input}
        />
        <TextInput
          placeholder="Contacto"
          value={newSupplierContact}
          onChangeText={setNewSupplierContact}
          style={styles.input}
        />
        <TextInput
          placeholder="Productos que Ofrece"
          value={newSupplierProducts}
          onChangeText={setNewSupplierProducts}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddSupplier}>
          <Text style={styles.buttonText}>Agregar Proveedor</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.supplierRow}>
            <Text style={styles.supplierText}>{item.name} - {item.contact}</Text>
            <Text style={styles.supplierProducts}>Productos: {item.products}</Text>
            <TouchableOpacity onPress={() => handleDeleteSupplier(item.id)}>
              <Text style={styles.deleteButton}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay proveedores.</Text>}
      />
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  supplierRow: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  supplierText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  supplierProducts: {
    color: '#666',
  },
  deleteButton: {
    color: '#D32F2F',
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default ManageSuppliersScreen;
