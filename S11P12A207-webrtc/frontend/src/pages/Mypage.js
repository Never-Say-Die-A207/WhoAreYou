import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';



const Mypage = () => {
const [ userData, setUserData ] = useState(null);
const [ friends, setFriends ] = useState(null);

    useEffect(() => {
            try {
                const response = api.get(`/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('userData error:', error);
            };
            try {
                const response = api.get(`/friend/list/${userId}`);
                setFriends(response.data);
            } catch (error) {
                console.error('friends error:', error);
            };
    }, []);

    return (
        <div>
            <h1>마이페이지</h1>
        </div>
    );
};

export default Mypage;