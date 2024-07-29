import React, { useState } from 'react';
import Login from './Login';
import Mypage from './Mypage';
import './Modal.css';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import mainimg from '../assets/mainimg.jpg';

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

    const mypage = () => {
        navigate('/mypage')
    };

    return (
        <div className='login-page'>

            <header className='layout-header'>
                <h1>who are you?</h1>
            </header>
            <div style={{ display: 'flex', height: '100vh' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                    <div className='layout-aside'>
                        <div className='layout-body login-page-view' data-lang='ko-KO'>
                            <div className='layout-aside'>
                                <img src={mainimg} alt="Main" />
                            </div>
                        </div>
                    </div>
            </div>
                
            
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ fontSize: '3rem' }}>로그인해주세요</h2>

                    <Login/>
            
                    <div>
                        <button onClick={mypage}>마이페이지</button>
                    </div>
                
                </div>
            
            </div>
        </div>
    );
};

export default Home;