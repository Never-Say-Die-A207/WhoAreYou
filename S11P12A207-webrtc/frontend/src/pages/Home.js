import React, { useState, useEffect } from 'react';
import Login from './Login';
import Logout from './Logout';
import './Modal.css';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import mainimg from '../assets/mainimg.jpg';

const Home = () => {
    const [loginModal, setLoginModal] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const onLoginSuccess = (userId) => {
        setUserId(userId);
        setLoginModal(false); // 로그인 성공 시 모달을 닫을 수 있습니다.
    };

    const onLogout = () => {
        setUserId(null);
    };

    const onLogin = () => {
        setLoginModal(true);
    };

    const closeLogin = () => {
        setLoginModal(false);
    };

    const onMatching = () => {
        navigate('/matching');
    };

    const mypage = () => {
        navigate('/mypage');
    };

    return (
        <div className='login-page'>
            <div style={{ display: 'flex', height: '100vh', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <div className='layout-aside'>
                    <div className='layout-body login-page-view' data-lang='ko-KO'>
                        <div className='layout-aside'>
                            <img src={mainimg} alt="Main" className='mainpage-pic'/>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {userId ? (
                        <div>
                            <h2 style={{ fontSize: '3rem' }}>안녕하세요 {userId}님 반갑습니다.</h2>
                            <div style={{ paddingTop: '30px' }}>
                                <Logout onLogout={onLogout} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ fontSize: '3rem' }}>로그인해주세요</h2>
                            <Login onLoginSuccess={onLoginSuccess} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;