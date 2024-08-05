import React, { useState, useEffect } from 'react';
import Login from './Login';
import Logout from './Logout';
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
        setLoginModal(false);
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

    // 회원가입 페이지로 이동하는 함수 추가
    const goToSignup = () => {
        navigate('/signup');
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

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '15px', gap:'10px' }}>
                    {userId ? (
                        <div>
                            <h2 style={{ fontSize: '3rem' }}>안녕하세요 {userId}님 반갑습니다.</h2>
                            <div style={{ paddingTop: '30px' }}>
                                <Logout onLogout={onLogout} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom:'2rem', marginTop:'1rem', fontWeight:'500' }}>로그인</h2>
                            <Login onLoginSuccess={onLoginSuccess} />

                            {/* 회원가입 버튼 추가 */}
                            <div className='mgt-sm'>
                                <div style={{ paddingTop: '30px' }}>
                                    <button
                                        style={{
                                            cursor: 'pointer',
                                            color: 'white',
                                            backgroundColor: '#aa4dcb',
                                            fontSize: '1.2rem',
                                            width: '50%',
                                            // height: '50px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            padding: '10px'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(150, 60, 180)'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#aa4dcb'}
                                        onClick={goToSignup} // 회원가입 함수 호출
                                    >
                                        회원가입
                                    </button>
                                </div>
                         
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
