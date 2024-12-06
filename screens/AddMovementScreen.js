import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, FlatList } from 'react-native';
import API from '../src/api/axios';
import { Picker } from '@react-native-picker/picker';

const AddMovementeScreen = ({navigation}) => {
  const [location, setLocation] = useState(''); //Depósito seleccionado
  const [location2, setLocation2] = useState('');
  const [locations, setLocations] = useState([]); //Lista de depósitos
  const [stock, setStock] = useState([]);
  const [movementDetails, setMovementDetails] = useState([]);
  const [tipoMovimiento, setTipoMovimiento] = useState([]);

  useEffect(() =>{
    fetchLocations();
    fetchStock();
  }, []);

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

  //Obtener stock
  const fetchStock = async () => {
    try{
      const response = await API.get('/api/stock');
      if(Array.isArray(response.data)){
        setStock(response.data);
      }else{
        Alert.alert('Error', 'La respuesta del servidor no es válida');
      }
    }catch(error){
      Alert.alert('Error', 'No se pudieron cargar los productos');
    }
  };

  //Agregar productos al movimiento
  const addDetail = (productId, quantity, unitPrice) => {
    setMovementDetails(prevDetails =>{
      const existingDetail = prevDetails.find(
        detail => detail.idProducto === productId
      );
      if(existingDetail){
        return prevDetails.map(detail =>
          detail.idProducto === productId
          ? {...detail, 
              cantidad: quantity,
              precioUnitario: unitPrice,
              precioTotal: quantity * unitPrice,
            }
          : detail
        );
      }
      return [
        ...prevDetails,
        {
          idProducto: productId,
          cantidad: quantity,
          precioUnitario: unitPrice,
          precioTotal: quantity * unitPrice,
        },
      ];
    });
  };

  const handleSubmit = async () => {
    if(!location || !location2 || !tipoMovimiento){
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if(movementDetails.length === 0){
      Alert.alert('Error', 'Debes agregar al menos un detalle de producto');
      return;
    }
    if(location === location2){
      Alert.alert('Error', 'El origen y el destino no pueden ser el mismo');
      return;
    }
    try{
      const movimientoResponse = {
        legajo: 13416, //Acá hay que modificar para que tome el usuario esta usando la app
        desde: location,
        hasta: location2,
        fecha: new Date().toISOString(),
        tipoMovimiento: tipoMovimiento,
        detalleMovimientos: movementDetails,
      };

      const response = await API.post ('/api/movimientos', movimientoResponse);

      if (response.status === 200) {
        Alert.alert('Éxito', 'Movimiento registrado con éxito');
        navigation.goBack();
      } else {
        Alert.alert('Error', ' else No se pudo registrar el movimiento');
      }
    }catch(error){
      Alert.alert('Error', 'No se pudo registrar el movimiento');
    }
  };

  return(
    <SafeAreaView style={styles.container}>
        <View style={styles.pickerContainer}>
            <Picker selectedValue={location} onValueChange={(itemValue) => {
                setLocation(itemValue);
            }}
            style={styles.picker}
            >
                <Picker.Item label="Seleccione deposito de salida" value=""/>
                {locations.map((loc) => (
                <Picker.Item
                    key={`${loc.codigo_deposito}-${loc.nombre}`}
                    label={loc.nombre}
                    value={loc.codigo_deposito}/>
                ))}
            </Picker>
        </View>
        <View style={styles.pickerContainer}>
            <Picker
            selectedValue={location2}
            onValueChange={(itemValue) => {
                setLocation2(itemValue);
            }}
            style={styles.picker}
            >
                <Picker.Item label="Seleccione destino" value=""/>
                {locations.map((loc) => (
                <Picker.Item
                    key={`${loc.codigo_deposito}-${loc.nombre}`}
                    label={loc.nombre}
                    value={loc.codigo_deposito}/>
                ))}
            </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoMovimiento}
            onValueChange={setTipoMovimiento}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione tipo de movimiento" value="" />
            <Picker.Item label="Entrada" value="Entrada" />
            <Picker.Item label="Salida" value="Salida" />
          </Picker>
        </View>

        <FlatList
          data={stock}
          keyExtractor={item => item.id_producto.toString()}
          renderItem={({ item }) => (
            item && (
              <View style={styles.productContainer}>
                <Text style={styles.productName}>{item.nombre}</Text>
                <Text style={styles.productPrice}>Stock: {item.cantidad}{item.unidad}</Text>
                <Text style={styles.productPrice}>
                  Precio Unitario: ${item.precio?.toFixed(2) || 'N/A'}
                </Text>
                <TextInput
                  style={styles.quantityInput}
                  placeholder="Cantidad"
                  keyboardType="numeric"
                  onChangeText={quantity => {
                    const parsedQuantity = parseInt(quantity, 10);
                    if (!isNaN(parsedQuantity) && parsedQuantity >= 0) {
                      addDetail(item.id_producto, parsedQuantity, item.precio);
                    } else {
                      Alert.alert('Error', 'Por favor ingresa una cantidad válida');
                    }
                  }}
                />
              </View>
            ))}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrar Movimiento</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#E8F5E9',
    },
    pickerContainer:{
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 15,
    },
    picker:{
      height: 50,
      borderColor: '#333',
    },
    input:{
      backgroundColor: '#FFF',
      padding: 10,
      borderRadius: 5,
      marginBottom: 15,
    },
    productContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFF',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    productName: {
      flex: 2,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    productPrice: {
      flex: 1,
      fontSize: 14,
      color: '#666',
    },
    quantityInput: {
      flex: 1,
      backgroundColor: '#FFF',
      padding: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#DDD',
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#4CAF50',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
});

export default AddMovementeScreen;