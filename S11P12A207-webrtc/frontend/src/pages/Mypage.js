import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import FriendCard from './FriendCard';


const Mypage = () => {
    // const [userData, setUserData] = useState(null);
    // const [friends, setFriends] = useState(null);
    const navigate = useNavigate();

    const userData = {
        name: '유저',
        email: 'email'
    };

    const friends = [
        // {
        //     "id": 1,
        //     "nickname": "황태건",
        //     "mask": "RedFox"
        // },
        // {
        //     "id": 2,
        //     "nickname": "김태건",
        //     "mask": "SpiderMan"
        // }
    ]


    // useEffect(() => {
    //     const userId = localStorage.getItem('userId');

    //     if (userId) {
    //         const getUserData = async () => {
    //             try {
    //                 // const response = api.get(`/${userId}`);
    //                 // setUserData(response.data);
    //             } catch (error) {
    //                 console.error('userData error:', error);
    //             };
    //         };

    //         const getFriends = async () => {
    //             try {
    //                 // const response = api.get(`/friend/list/${userId}`);
    //                 // setFriends(response.data);
    //             } catch (error) {
    //                 console.error('friends error:', error);
    //             };
    //         };

    //         getUserData();
    //         getFriends();

    //     } else {
    //         navigate('/');
    //     };
    // }, []);

    return (
        <div>
            <h1>마이페이지</h1>
            {userData && (
                <div>
                    <h2>이름: {userData.name}</h2>
                    <p>Email: {userData.email}</p>
                </div>
            )}
            {friends.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {friends.map((friend) => (
                        <FriendCard key={friend.id} friend={friend} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', color: '#666' }}>
                    친구가 없어요! 새로운 친구를 사귀어 보세요.
                </div>
            )}
        </div>
    );
};

export default Mypage;