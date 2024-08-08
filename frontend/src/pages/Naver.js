import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import naverimg from '../assets/naver.ico';
import { jwtDecode } from 'jwt-decode';
import './Naver.css';

const Naver = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        window.location.href = 'http://3.36.120.21:4040/oauth2/authorization/naver';
    };

    useEffect(() => {
        const currentUrl = window.location.href;

        if (currentUrl.includes('/auth/oauth-response/')) {
            const url = new URL(currentUrl);
            const pathname = url.pathname;
            const tokenMatch = pathname.match(/\/auth\/oauth-response\/([^\/]+)\//);
            
            if (tokenMatch && tokenMatch[1]) {
                const token = tokenMatch[1];
                localStorage.setItem('token', token);

                try {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.sub;
                    console.log(decodedToken)
                    localStorage.setItem('userId', userId);
                    navigate('/matching');
                } catch (error) {
                    console.error('Naver token:', error);
                }
            }
        }
    }, [navigate]);

    return (
        <div className='naver-img-div'>
            <img src={naverimg} alt="네이버" onClick={handleLogin} className='naver-img' />
        </div>
    );
};

export default Naver;