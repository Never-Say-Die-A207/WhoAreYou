import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    // 로컬
    // baseURL: 'http://localhost:5000',

    // 서버
    baseURL: 'http://3.36.120.21:4040',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
