import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();
    
    const onClick = async () => {
        localStorage.clear();
        
        // onLogout 콜백 호출
        onLogout();
        
        window.location.reload();
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
