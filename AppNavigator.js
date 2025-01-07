import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import StockScreen from './screens/StockScreen';
import AddItemScreen from './screens/AddItemScreen';
import EditItemScreen from './screens/EditItemScreen';
import AddCompraScreen from './screens/AddCompraScreen';
import AddMovementScreen from './screens/AddMovementScreen';
import AddUserScreen from './screens/AddUserScreen';
import AddDepoScreen from './screens/AddDepoScreen';
import SettingsScreen from './screens/SettingsScreen';
import ManageUsersScreen from './screens/ManageUsersScreen';
import ManageLocationsScreen from './screens/ManageLocationsScreen';
import ManageSuppliersScreen from './screens/ManageSuppliersScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import CompraScreen from './screens/CompraScreen';
import MovementHistoryScreen from './screens/MovementHistoryScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [cargo, setCargo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const token = await AsyncStorage.getItem('token');

        if(token){
          const userData = await AsyncStorage.getItem('user');
          if(userData){
            const {cargo} = JSON.parse(userData);
            setCargo(cargo);
            setIsAuthenticated(true);
          }
        }
        console.log("Cargo obtenido:",cargo);
      } catch(error){
        console.error('Error al obtener el cargo del usuario', error);
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Pantalla de Bienvenida */}
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />

      {/* Pantalla de Inicio de Sesión */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Iniciar Sesión' }}
      />

      {/* Pantalla de Recuperación de Contraseña */}
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Recuperar Contraseña' }}
      />

      {/* Pantalla para Añadir Artículo */}
      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{ title: 'Añadir nuevo artículo' }}
      />

      {/* Pantalla para Editar Artículo */}
      <Stack.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{ title: 'Modificar artículo' }}
      />

      {/* Pantalla para Registrar Compra */}
      <Stack.Screen
        name="AddCompra"
        component={AddCompraScreen}
        options={{ title: 'Registrar compra' }}
      />

      {/* Pantalla para Registrar Usuario */}
      <Stack.Screen
        name="AddUser"
        component={AddUserScreen}
        options={{ title: 'Registrar usuario' }}
      />

      {/* Pantalla para Registrar Movimiento */}
      <Stack.Screen
        name="AddMovement"
        component={AddMovementScreen}
        options={{ title: 'Registrar movimiento' }}
      />

      {/* Pantalla para Añadir Deposito */}
      <Stack.Screen
        name="AddDepo"
        component={AddDepoScreen}
        options={{ title: 'Añadir depósito' }}
      />

      {/* Pantalla de Configuración */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />

      {/* Pantalla de Gestión de Usuarios */}
      <Stack.Screen
        name="ManageUsers"
        component={ManageUsersScreen}
        options={{ title: 'Gestión de Usuarios' }}
      />

      {/* Pantalla de Gestión de Depósitos */}
      <Stack.Screen
        name="ManageLocations"
        component={ManageLocationsScreen}
        options={{ title: 'Gestión de Depósitos' }}
      />

      {/* Pantalla de Gestión de Proveedores */}
      <Stack.Screen
        name="ManageSuppliers"
        component={ManageSuppliersScreen}
        options={{ title: 'Gestión de Proveedores' }}
      />

      {/* Pantalla Principal */}
      <Stack.Screen
        name="MainApp"
        options={{ headerShown: false }}
      >
        {() => <MainTabNavigator cargo={cargo} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const MainTabNavigator = ({cargo}) => (
  <Tab.Navigator
    initialRouteName="Inicio"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size = 28 }) => {
        let iconName;

        switch (route.name) {
          case 'Inicio':
            iconName = 'chart-line';
            break;
          case 'Inventario':
            iconName = 'warehouse';
            break;
          case 'Movimientos':
            iconName = 'history';
            break;
          case 'Compras':
            iconName = 'cart';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { height: 60 },
      tabBarLabelStyle: { fontSize: 14 },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Inicio" component={StatisticsScreen} />
    <Tab.Screen name="Inventario" component={StockScreen} />
    <Tab.Screen name="Movimientos" component={MovementHistoryScreen} />
    {cargo === 'ADMIN' &&(
      <Tab.Screen name="Compras" component={CompraScreen} />
    )}
  </Tab.Navigator>
);

export default AppNavigator;