import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import FriendCard from './FriendCard';


const Mypage = () => {
    const [userData, setUserData] = useState(null);
    const [friends, setFriends] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            const getUserData = async () => {
                try {
                    // const response = api.get(`/${userId}`);
                    // setUserData(response.data);
                } catch (error) {
                    console.error('userData error:', error);
                };
            };

            const getFriends = async () => {
                try {
                    // const response = api.get(`/friend/list/${userId}`);
                    // setFriends(response.data);
                } catch (error) {
                    console.error('friends error:', error);
                };
            };

            getUserData();
            getFriends();

        } else {
            navigate('/');
        };
    }, []);

    return (
        <div>
            <h1>마이페이지</h1>
            {userData && (
                <div>
                    <h2>이름: {userData.name}</h2>
                    <p>Email: {userData.email}</p>
                </div>
            )}
            {friends && (
                <div>
                    {friends.map((friend) => (
                        <FriendCard key={friend.id} friend={friend} />
                    ))}
                </div>
            )};
        </div>
    );
};

export default Mypage;