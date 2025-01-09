import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (token, userData) => {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        await AsyncStorage.clear();
        setUser(null);
    };

    //Restaura sesión (si se ha iniciado antes) al inciar la app
    useEffect (() =>{
        const restoreSession = async () => {
            try{
                const token = await AsyncStorage.getItem('token');
                const storedUser = await AsyncStorage.getItem('user');
                if(token && storedUser){
                    setUser(JSON.parse(storedUser)); //Restaurar usuario
                }
            } catch (error) {
                console.error('Error al restaurar sesión', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        restoreSession();
    }, []);

    return(
        <AuthContext.Provider value={{user, setUser, login, logout}}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);