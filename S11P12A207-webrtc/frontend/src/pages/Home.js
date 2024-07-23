import React, { useState } from 'react';
import Login from './Login';
import './Modal.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [loginModal, setLoginModal] = useState(false);
    const navigate = useNavigate();

    const onLogin = (e) => {
        setLoginModal(true);
    };

    const closeLogin = () => {
        setLoginModal(false);
    };

    const onMatching = () => {
        navigate('/matching')
    };

    return (
        <div>
            <h1>홈이야</h1>
            <p onClick={onLogin} style={{ cursor: 'pointer', color: 'blue' }}>로그인</p>
            {loginModal && <Login onClose={closeLogin} />}
            <p onClick={onMatching} style={{ cursor: 'pointer', color: 'blue' }}>매칭하기</p>
        </div>
    );
};

export default Home;