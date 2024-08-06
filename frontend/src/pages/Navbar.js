import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Logout from './Logout';

const Navbar = ({ userId, onLogout }) => {
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
                <div className="container-fluid">
                    <Link to='/' className="navbar-brand">WHO ARE YOU</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to='/matching' className='nav-link'>매칭하기</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/mypage' className='nav-link'>마이페이지</Link>
                            </li>
                        </ul>
                    </div>
                    {!userId ? (
                        <Link to='/'>
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
                            >
                                로그인
                            </button>
                        </Link>
                    ) : (
                        <Logout onLogout={onLogout} />
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
