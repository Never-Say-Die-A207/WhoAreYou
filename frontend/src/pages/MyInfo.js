import React, { useEffect, useState } from 'react';
import api from '../api/api';
import './Modal.css';

const MyInfo = ({ onClose }) => {
    const [info, setInfo] = useState({
        email: '',
        matchingCount: '',
        name: '',
        nickname: '',
        successCount: '',
    });
    const [rate, setRate] = useState(null);

    const { email, name, nickname, matchingCount, successCount } = info;

    const getMyInfo = async () => {
        try {
            const response = await api.get(`/user/${localStorage.getItem('userId')}`);
            setInfo(response.data);

        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const matchingCal = async (mc, sc) => {
        const cal = (sc/mc).toFixed(2)*100;
        setRate(cal);
    }

    useEffect(() => {
        getMyInfo();
        matchingCal(matchingCount, successCount);
    }, [matchingCount, successCount]);

    return (
        <div className="my-info-modal">
            <h2><strong>{email}</strong></h2>
            <div className="my-info-content">
                <div className="info-box">
                    <strong>이름:</strong>
                    <p>{name}</p>
                </div>
                <div className="info-box">
                    <strong>닉네임:</strong>
                    <p>{nickname}</p>
                </div>
                <div className="info-box">
                    <strong>매칭 성공률:</strong>
                    <p>{rate} %</p>
                </div>
            </div>
            <button className="close" onClick={onClose}>닫기</button>
        </div>
    );
};

export default MyInfo;
