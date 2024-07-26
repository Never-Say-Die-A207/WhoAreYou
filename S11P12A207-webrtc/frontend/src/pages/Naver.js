import React, { useEffect } from 'react';

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
        <div>
            <h1>네이버 테스트</h1>
            <button onClick={handleLogin}>네이버 로그인</button>
        </div>
    );
};

export default Naver;
