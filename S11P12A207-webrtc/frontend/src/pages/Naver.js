import React, { useEffect } from 'react';
import naverimg from '../assets/naver.ico';
import './Naver.css';

const Naver = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:4040/oauth2/authorization/naver';
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const profile = urlParams.get('profile');

        if (profile) {
            const userProfile = JSON.parse(profile);
            console.log(userProfile);
        }
    }, []);

    return (
        <div className='naver-img-div'>
            <img src={naverimg} alt="네이버" onClick={handleLogin} className='naver-img' />            
        </div>
    );
};

export default Naver;
