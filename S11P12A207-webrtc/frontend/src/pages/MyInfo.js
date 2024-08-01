import React, { useEffect, useState } from "react";
import api from '../api/api';
import './Modal.css'; // 커스텀 스타일 import

const MyInfo = ({ onClose }) => {
    const user = { email: '11@11', name: 'name', nickname: 'nickname', };


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
            <span className="close" onClick={onClose}>&times;</span>
            <h2>내정보</h2>
            <div className="my-info-content">
                <p><strong>이메일:</strong> {email}</p>
                <p><strong>이름:</strong> {name}</p>
                <p><strong>닉네임:</strong> {nickname}</p>
            </div>
        </div>
    );
};

export default MyInfo;
