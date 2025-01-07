import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-web';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /*useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await API.get('/api/auth/verify-token', {
            headers: { Authorization: Bearer ${token} },
          });
          if (response.status === 200) {
            navigation.navigate('MainApp');
          }
        } catch (error) {
          console.error('Error al validar el token:', error);
          // Elimina el token si es inválido
          await AsyncStorage.removeItem('token');
        }
      }
    };
    checkToken();
  }, []);*/

  const handleLogin = async () => {
    if(!username || !password){
      Alert.alert('Error', 'Por favor, complete los campos');
      return;
    }

    const payload = { legajo: parseInt(username), pass: password };

    try {
      const response = await API.post('/api/auth/login', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        const data = response.data;
        if (data.token) {
          await AsyncStorage.setItem('token',data.token.trim());
          await AsyncStorage.setItem('user', JSON.stringify({legajo:data.legajo, cargo:data.cargo}));
          navigation.navigate('MainApp');
        }
        else{
          Alert.alert('Error', 'No se recibió un token de autenticación');
        }
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      if (error.response) {
        Alert.alert(
          'Error',
          error.response.data.message || 'Usuario o contraseña incorrectos'
        );
      } else {
        Alert.alert(
          'Error',
          'No se pudo conectar con el servidor. Inténtalo de nuevo.'
        );
      }
    }
  };

  return (
    <View style={styles.container}>
        {/* Logo de la aplicación */}
        <Image source={require('../assets/logo.png')} style={styles.logo}/>
        {/* Texto de Bienvenida */}
        <Text style={styles.title}>¡Bienvenido a la Gestión de Inventario!</Text>
        <Text style={styles.subtitle}>Administra tus inventarios de forma rápida y sencilla</Text>

      <View style={styles.inputContainer}>
        <Icon name="account" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          placeholder="Legajo"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#888"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#888"
          secureTextEntry
        />
      </View>

      {/*Boton inicio de sesión y barra de carga*/}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>
          ¿Te olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 170,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;