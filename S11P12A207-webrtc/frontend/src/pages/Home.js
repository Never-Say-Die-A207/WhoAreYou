import React, { useState } from 'react';
import Login from './Login';
import Naver from './Naver';
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
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '3rem' }}>홈이야</h1>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <button
                    onClick={onLogin}
                    style={{
                        cursor: 'pointer',
                        color: 'white',
                        backgroundColor: '#87CEFA',
                        fontSize: '1.5rem',
                        width: '200px',
                        height: '50px',
                        marginBottom: '20px',
                        border: 'none',
                        borderRadius: '5px',
                        textAlign: 'center'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#6CA0DC'} // 호버 적용
                    onMouseOut={(e) => e.target.style.backgroundColor = '#87CEFA'} // 호버 해제
                >
                    로그인
                </button>
                {loginModal && <Login onClose={closeLogin} />}
                <button
                    onClick={onMatching}
                    style={{
                        cursor: 'pointer',
                        color: 'white',
                        backgroundColor: '#87CEFA',
                        fontSize: '1.5rem',
                        width: '200px',
                        height: '50px',
                        border: 'none',
                        borderRadius: '5px',
                        textAlign: 'center'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#6CA0DC'} // 호버 적용
                    onMouseOut={(e) => e.target.style.backgroundColor = '#87CEFA'} // 호버 해제
                >
                    매칭하기
                </button>
            </div>
            <div>
                <Naver />
            </div>
        </div>
    );
};

export default Home;