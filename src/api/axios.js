import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API = axios.create({
    //baseURL: 'http://localhost:8080',
    baseURL: 'http://192.168.1.101:8080',
    timeout: 5000,
});

API.interceptors.request.use(
    async (config) => {
        if(!config.headers.Authorization){ //Verificar si ya existe un encabezado Authorization en la solicitud
            const token = await AsyncStorage.getItem('token'); // Obtén el token almacenado de AsyncStorage
            if(token) {
                config.headers.Authorization = token.startsWith('Bearer ')
                ? token
                : `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    response => response,
    async(error) => {
        if(error.response && error.response.status === 401){
            await AsyncStorage.clear();
            Alert.alert('Sesión expirada', 'Por favor, inicia sesión de nuevo');
        }

        return Promise.reject(error);
    }
);

export default API;