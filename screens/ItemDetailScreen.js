import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ItemDetailScreen = ({ route, navigation }) => {
  // Obtenemos los datos del ítem desde los parámetros de navegación
  const { item } = route.params;

  // Función para navegar a la pantalla de edición del ítem
  const handleEditItem = () => {
    navigation.navigate('EditItem', { item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detalles del Ítem</Text>

      {/* Mostrar detalles del ítem */}
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Nombre:</Text>
        <Text style={styles.detailValue}>{item.name}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Cantidad:</Text>
        <Text style={styles.detailValue}>{item.quantity}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Precio:</Text>
        <Text style={styles.detailValue}>{item.price}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Ubicación:</Text>
        <Text style={styles.detailValue}>{item.location}</Text>
      </View>

      {/* Botón para editar el ítem */}
      <Button title="Editar Ítem" onPress={handleEditItem} />

      {/* Botón para regresar a la pantalla anterior */}
      <Button title="Volver" onPress={() => navigation.goBack()} />
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
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 2,
  },
});

export default ItemDetailScreen;
