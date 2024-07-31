import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();
    
    const onClick = async () => {
        localStorage.clear();
        
        // onLogout 콜백 호출
        onLogout();
        
        navigate('/');
    };

    return (
        <button
            style={{
                cursor: 'pointer',
                color: 'white',
                backgroundColor: '#aa4dcb',
                fontSize: '1.5rem',
                width: '200px',
                height: '50px',
                border: 'none',
                borderRadius: '5px',
                textAlign: 'center'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#8530e9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#aa4dcb'}
            onClick={onClick}
        >
            로그아웃
        </button>
    );
};

export default Logout;
