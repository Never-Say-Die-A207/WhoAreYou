import React, { useState } from 'react';
import Login from './Login';
import Naver from './Naver';
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
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '3rem' }}>홈이야</h1>
                <header className='layout-header'>
                <h1>who are you?</h1>
            </header>
            <div className='layout-body login-page-view' data-lang='ko-KO'>
                <div className='layout-aside'>
                    <img src={mainimg} alt="Main" />
                </div>
            </div>
        </div>
            
           
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Login/>
          
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
            <div>
                <button onClick={mypage}>마이페이지</button>
            </div>
        </div>
    );
};

export default Home;