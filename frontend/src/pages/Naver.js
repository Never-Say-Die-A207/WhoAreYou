import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import naverimg from '../assets/naver.ico';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';
import './Naver.css';

const Naver = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        window.location.href = 'http://3.36.120.21:4040/oauth2/authorization/naver';
    };

    useEffect(() => {
        const handleOAuthResponse = async () => {
            const currentUrl = window.location.href;
    
            if (currentUrl.includes('/auth/oauth-response/')) {
                const url = new URL(currentUrl);
                const pathname = url.pathname;
                const tokenMatch = pathname.match(/\/auth\/oauth-response\/([^\/]+)\//);
                
                if (tokenMatch && tokenMatch[1]) {
                    const token = tokenMatch[1];

                    //원래는 토큰을 각각 받아야함
                    localStorage.setItem('accessToken', token);
                    localStorage.setItem('accessTokenExpirationTime', 3600);
                    localStorage.setItem('refreshToken', token);
                    localStorage.setItem('refreshTokenExpirationTime', 1209600);
    
                    try {
                        // 토큰 디코딩
                        const decodedAccessToken = jwtDecode(token);
    
                        // userId 추출
                        const userId = decodedAccessToken.sub;
    
                        localStorage.setItem('userId', userId);
    
                        // 사용자 정보를 가져오기
                        const userResponse = await api.get(`/user/${userId}`);
                        localStorage.setItem('nickname', userResponse.data['nickname']);
                        navigate('/matching');
                    } catch (error) {
                        console.error('Naver token:', error);
                    }
                }
            }
        };
    
        handleOAuthResponse();
    }, [navigate]);

    // useEffect(() => {
    //     const currentUrl = window.location.href;

    //     if (currentUrl.includes('/auth/oauth-response/')) {
    //         const url = new URL(currentUrl);
    //         const pathname = url.pathname;
    //         const tokenMatch = pathname.match(/\/auth\/oauth-response\/([^\/]+)\//);
            
    //         if (tokenMatch && tokenMatch[1]) {
    //             const token = tokenMatch[1];
    //             // localStorage.setItem('token', token);

    //             //임시..
    //             localStorage.setItem('accessToken', token);
    //             localStorage.setItem('accessTokenExpirationTime', 3600);
    //             localStorage.setItem('refreshToken', token);
    //             localStorage.setItem('refreshTokenExpirationTime', 1209600);

    //             try {
    //                 //임시..

    //                 // const decodedToken = jwtDecode(token);
    //                 // const userId = decodedToken.sub;
    //                 // console.log(decodedToken)
    //                 // localStorage.setItem('userId', userId);

    //                 // 토큰 디코딩
    //                 const decodedAccessToken = jwtDecode(token);

    //                 // userId 추출
    //                 const userId = decodedAccessToken.sub;

    //                 localStorage.setItem('userId', userId);
    //                 //localStorage.setItem('accessToken', accessToken);

    //                 // 사용자 정보를 가져오기
    //                 const userResponse = await api.get(`/user/${userId}`);
    //                 localStorage.setItem('nickname', userResponse.data['nickname']);
    //                 navigate('/matching');
    //             } catch (error) {
    //                 console.error('Naver token:', error);
    //             }
    //         }
    //     }
    // }, [navigate]);

    return (
        <div className='naver-img-div'>
            <img src={naverimg} alt="네이버" onClick={handleLogin} className='naver-img' />
        </div>
    );
};

export default Naver;
