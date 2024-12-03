import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import API from '../src/api/axios';
import { Picker } from '@react-native-picker/picker';

const AddMovementeScreen = ({navigation}) => {
  const [location, setLocation] = useState(''); //Depósito seleccionado
  const [locations, setLocations] = useState([]); //Lista de depósitos
  const [stock, setStock] = useState([]);

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

  return(
    <SafeAreaView style={styles.container}>
        <View style={styles.pickerContainer}>
            <Picker
            selectedValue={location}
            onValueChange={(itemValue) => {
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
            selectedValue={location}
            onValueChange={(itemValue) => {
                setLocation(itemValue);
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
    </SafeAreaView>
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
      marginVertical: 5,
    },
});

export default AddMovementeScreen;