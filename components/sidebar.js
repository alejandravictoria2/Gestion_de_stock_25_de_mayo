import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-250)); // Inicia fuera de la vista

  const toggleSidebar = () => {
    const toValue = isOpen ? -250 : 0;

    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
        <Text style={styles.toggleButtonText}>{isOpen ? 'Cerrar' : 'Abrir'} Menú</Text>
      </TouchableOpacity>
      
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Inventario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Movimientos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Configuración</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 1000,
    flexDirection: 'row',
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1001,
    backgroundColor: '#34e89e',
    padding: 10,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sidebar: {
    width: 250,
    backgroundColor: '#141414',
    padding: 20,
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#34e89e',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
