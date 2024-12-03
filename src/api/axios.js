import axios from 'axios';

const API = axios.create({
    //baseURL: 'http://localhost:8080/api',
    baseURL: 'http://192.168.1.32:8080',
    timeout: 5000,
});

export default API;