import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Logout = () => {
    const navigate = useNavigate();
    const onClick = async () => {
        localStorage.removeItem('accessToken');
        navigate('/');
    };

    return (
        <button onClick={onClick}>로그아웃</button>
    );
};

export default Logout;