import React from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();
    
    const onClick = async () => {
        // 로컬 스토리지 정보 삭제
        const userId = localStorage.getItem('userId');
        const response = await api.post('/logout', {userId});
        
        if(response.data.code === "SU"){
            localStorage.clear();
            
            // 상위 컴포넌트에 onLogout 콜백 호출
            onLogout();
            
            // 홈 페이지 리디렉션
            window.location.reload();
        } else{
            console.log("로그아웃에 실패했습니다.");
        };

    };

    return (
        <button
            style={{
                cursor: 'pointer',
                color: 'white',
                backgroundColor: '#aa4dcb',
                fontSize: '1.2rem',
                width: '200px',
                height: '50px',
                border: 'none',
                borderRadius: '5px',
                textAlign: 'center',
                fontWeight: '600'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(150, 60, 180)'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#aa4dcb'}
            onClick={onClick}
        >
            로그아웃
        </button>
    );
};

export default Logout;
