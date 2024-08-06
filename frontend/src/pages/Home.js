import React, { useState, useEffect } from 'react';
import Login from './Login';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import mainimg from '../assets/mainimg.jpg';
import Navbar from './Navbar';

const Home = () => {
    const [loginModal, setLoginModal] = useState(false);
    // const [userId, setUserId] = useState(null);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const storedUserId = localStorage.getItem('userId');
    //     if (storedUserId) {
    //         setUserId(storedUserId);
    //     }
    // }, []);

    // const onLoginSuccess = (userId) => {
    //     setUserId(userId);
    //     setLoginModal(false);
    //     // 로그인 성공 후 'matching' 페이지로 이동
    //     navigate('/matching');
    // };


    // const onLogout = () => {
    //     setUserId(null);
    // };

    const [userId, setUserId] = useState(() => localStorage.getItem('userId')); // 초기값을 로컬스토리지에서 가져옵니다.
    const navigate = useNavigate();

    const onLoginSuccess = (userId) => {
        console.log('Login successful, userId:', userId);
        setUserId(userId);
        localStorage.setItem('userId', userId);  // 로컬스토리지에도 저장
        navigate('/matching'); // 로그인 성공 후 매칭 페이지로 이동
    };

    const onLogout = () => {
        setUserId(null);
        localStorage.removeItem('userId'); // 로그아웃할 때 로컬스토리지에서 제거
        navigate('/'); // 로그아웃 시 홈으로 리디렉션
    };

    const onLogin = () => {
        setLoginModal(true);
    };

    const closeLogin = () => {
        setLoginModal(false);
    };

    const goToSignup = () => {
        navigate('/signup');
    };

    return (
        <div className='login-page'>
            <Navbar />
            <div style={{ display: 'flex', height: '100vh', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <div className='layout-aside'>
                    <img src={mainimg} alt="Main" className='mainpage-pic'/>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '15px', gap: '10px' }}>
                    {userId ? (
                        <div>
                            <h2 style={{ fontSize: '3rem' }}>안녕하세요 {userId}님 반갑습니다.</h2>
                            <Logout onLogout={onLogout} />
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', marginTop: '1rem', fontWeight: '500' }}>로그인</h2>
                            <Login onLoginSuccess={onLoginSuccess} />
                        </div>
                    )}
                </div>
            </div>
        </div>
 

        // <div className='login-page'>
        //     <Navbar userId={userId} onLogout={onLogout} />
        //     <div style={{ display: 'flex', height: '100vh', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        //         <div className='layout-aside'>
        //             <div className='layout-body login-page-view' data-lang='ko-KO'>
        //                 <div className='layout-aside'>
        //                     <img src={mainimg} alt="Main" className='mainpage-pic'/>
        //                 </div>
        //             </div>
        //         </div>

        //         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '15px', gap:'10px' }}>
        //             {userId ? (
        //                 <div>
        //                     <h2 style={{ fontSize: '3rem' }}>안녕하세요 {userId}님 반갑습니다.</h2>
        //                     <div style={{ paddingTop: '30px' }}>
        //                         <Logout onLogout={onLogout} />
        //                     </div>
        //                 </div>
        //             ) : (
        //                 <div>
        //                     <h2 style={{ fontSize: '2rem', marginBottom:'2rem', marginTop:'1rem', fontWeight:'500' }}>로그인</h2>
        //                     <Login onLoginSuccess={onLoginSuccess} />
        //                     {/* <div className='mgt-sm'>
        //                         <div style={{ paddingTop: '30px' }}>
        //                             <button
        //                                 style={{
        //                                     cursor: 'pointer',
        //                                     color: 'white',
        //                                     backgroundColor: '#aa4dcb',
        //                                     fontSize: '1.2rem',
        //                                     width: '50%',
        //                                     border: 'none',
        //                                     borderRadius: '5px',
        //                                     textAlign: 'center',
        //                                     fontWeight: 'bold',
        //                                     padding: '10px'
        //                                 }}
        //                                 onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(150, 60, 180)'}
        //                                 onMouseOut={(e) => e.target.style.backgroundColor = '#aa4dcb'}
        //                                 onClick={goToSignup}
        //                             >
        //                                 회원가입
        //                             </button>
        //                         </div>
        //                     </div> */}
        //                 </div>
        //             )}
        //         </div>
        //     </div>
        // </div>
    );
};

export default Home;
