import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../src/api/axios';
import { Picker } from '@react-native-picker/picker';

const AddCompraScreen = ({ navigation }) => {
    // Estados para almacenar la información del nuevo ítem
    const [proveedor, setProveedor] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [location, setLocation] = useState(''); //Depósito seleccionado
    const [locations, setLocations] = useState([]); //Lista de depósitos
    const [detalleCompra, setDetalleCompra] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({nombre: '', cantidad: '', precioTotal: '', tipo: ''});

    //Obtenemos los depósitos para cargar en la lista
    useEffect(() =>{
      fetchLocations();
      fetchProveedor();
    }, []);
  
    //Obtener proveedor
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

    //Obtener depósitos
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
  
    const handleAddArticulo = () => {
      const {nombre, cantidad, precioTotal, unidad} = nuevoProducto;
      if(!nombre || !cantidad || !precioTotal || !unidad){
        Alert.alert('Error', 'Completa todos los campos del producto');
        return;
      }
      
      //Calculamos precio unitario
      const precioUnitario = parseFloat(precioTotal)/parseInt(cantidad);

      // Agregar el producto a la lista de detalle
      setDetalleCompra((prev) => [
        ...prev,
        { nombre, cantidad: parseInt(cantidad), unidad, precio_total: parseFloat(precioTotal), precioUnitario, tipo, },
      ]);

        // Limpiar los campos del nuevo producto
        setNuevoProducto({ nombre: '', cantidad: '', precioTotal: '', tipo: '' });
        setModalVisible(false);
    };

    // Remover artículo de la lista
    const handleRemoveArticulo = (index) => {
      setDetalleCompra((prev) => prev.filter((_, i) => i !== index));
    };

    // Función para manejar el envío del formulario
    const handleAddCompra = async () => {;
      if (!location || detalleCompra.length === 0) {
        Alert.alert('Error', 'Por favor completa todos los campos.');
        return;
      }

      const fechaCompra = new Date().toISOString().split('T')[0];

      try{
        const nuevaCompra = {
          cuitProveedor: proveedor,
          fechaCompra: fechaCompra,
          codigoDeposito: location,
          detalleCompras: detalleCompra.map((item) => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            unidad: item.unidad,
            precio: item.precioUnitario,
            tipo: item.tipo,
          })),
        };

        await API.post('/api/compras', nuevaCompra);
        Alert.alert('Éxito', 'Compra registrada correctamente');
        navigation.goBack();
      } catch(error){
        Alert.alert('Error', 'No se pudo registrar la compra');
        console.log(error);
      }
    };
  
    return (
      <View style={styles.container}>
        
        <View style={styles.pickerContainer}>
          <Picker selectedValue={proveedor} onValueChange={setProveedor} style={styles.picker}>
              <Picker.Item label="Selecciona un proveedor" value=""/>
              {proveedores.map((pro) => (
                <Picker.Item
                  key={`${pro.cuitProveedor}-${pro.nombre}`}
                  label={pro.nombre}
                  value={pro.cuitProveedor}/>
              ))}
            </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker selectedValue={location} onValueChange={setLocation} style={styles.picker}>
              <Picker.Item label="Selecciona un depósito" value=""/>
              {locations.map((loc) => (
                <Picker.Item key={`${loc.codigo_deposito}-${loc.nombre}`} label={loc.nombre} value={loc.codigo_deposito}/>
              ))}
            </Picker>
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Artículo</Text>
        </TouchableOpacity>

        <FlatList
          ListHeaderComponent={
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeader}>Nombre</Text>
              <Text style={styles.tableHeader}>Cantidad</Text>
              <Text style={styles.tableHeader}>Precio</Text>
              <Text style={styles.tableHeader}>Unitario</Text>
              <Text style={styles.tableHeader}>Acciones</Text>
            </View>
          }
          data={detalleCompra}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.nombre}</Text>
              <Text style={styles.tableCell}>{item.cantidad}</Text>
              <Text style={styles.tableCell}>
                U$S{(item.precio_total || 0).toFixed(2)}
              </Text>
              <Text style={styles.tableCell}>U$S{item.precioUnitario.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => handleRemoveArticulo(index)}>
                <Icon name="delete" size={24} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          )}
        />
        
        <TouchableOpacity style={styles.registerButton} onPress={handleAddCompra}>
          <Text style={styles.addButtonText}>AGREGAR</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Agregar Artículo</Text>
              <TextInput
                placeholder="Nombre del artículo"
                style={styles.input}
                value={nuevoProducto.nombre}
                onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, nombre: text })}
              />
              <TextInput
                placeholder="Tipo de producto"
                style={styles.input}
                value={nuevoProducto.tipo}
                onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, tipo: text })}
              />
              <View style={styles.rowContainer}>
                <TextInput
                  placeholder="Cantidad"
                  style={[styles.input, styles.halfWidth]}
                  keyboardType="numeric"
                  value={nuevoProducto.cantidad}
                  onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, cantidad: text })}
                />
                <TextInput
                  placeholder="Unidad"
                  style={[styles.input, styles.halfWidth]}
                  value={nuevoProducto.unidad}
                  onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, unidad: text })}
                />
              </View>
              <TextInput
                placeholder="Precio total"
                style={styles.input}
                keyboardType="numeric"
                value={nuevoProducto.precioTotal}
                onChangeText={(text) => setNuevoProducto({ ...nuevoProducto, precioTotal: text })}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddArticulo}>
                <Text style={styles.addButtonText}>Agregar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
    pickerContainer:{
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    picker:{
      height: 50,
      borderColor: '#333',
    },
    addButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    tableContainer: {
      paddingHorizontal: 10,
      marginTop:10,
    },
    tableHeaderRow: {
      flexDirection: 'row',
      backgroundColor: '#4CAF50',
      padding: 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    tableHeader: {
      flex: 1,
      fontWeight: 'bold',
      color: '#FFF',
      textAlign: 'center',
      fontSize: 14,
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 10,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    tableCell: {
      flex: 1,
      fontSize: 12,
      color: '#333',
      textAlign: 'center',
    },
    rowContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfWidth: {
      flex: 1,
      marginRight: 5,
    },
    registerButton: {
      backgroundColor: '#28a745',
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    registerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: '#4CAF50',
    },
    input: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      fontSize: 14,
    },
    closeButton: {
      backgroundColor: '#FF3B30',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginTop: 10,
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default AddCompraScreen;