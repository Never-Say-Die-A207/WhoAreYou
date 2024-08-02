import React, { useEffect, useState } from 'react';
import api from '../api/api';
import './Modal.css';

const MyInfo = ({ onClose }) => {
    const user = { email: '11@11', name: 'name', nickname: 'nickname' };

    const [info, setInfo] = useState({
        email: '',
        name: '',
        nickname: ''
    });

    const { email, name, nickname } = user;

    const getMyInfo = async () => {
        try {
            const response = await api.get('/my');
            setInfo(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        getMyInfo();
    }, []);

    return (
        <div className="my-info-modal">
            <h2><strong>내정보</strong></h2>
            <div className="my-info-content">
                <div className="info-box">
                    <strong>이메일:</strong>
                    <p>{email}</p>
                </div>
                <div className="info-box">
                    <strong>이름:</strong>
                    <p>{name}</p>
                </div>
                <div className="info-box">
                    <strong>닉네임:</strong>
                    <p>{nickname}</p>
                </div>
            </div>
            <button className="close" onClick={onClose}>닫기</button>
        </div>
    );
};

export default MyInfo;
