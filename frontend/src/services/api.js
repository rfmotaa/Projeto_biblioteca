import axios from 'axios';

// porta padrão do springboot 
const api = axios.create({
    baseURL: 'http://localhost:8080', 
});

export default api;