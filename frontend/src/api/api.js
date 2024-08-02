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

    if (token && expirationTime) {
        const now = Date.now();
        if (now > parseInt(expirationTime, 10)) {
            const navigate = useNavigate();
            console.error('Token expired');
            localStorage.clear();
            window.alert('토큰이 만료되었습니다. 다시 로그인 해주세요.');
            navigate('/');
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

export default api;
