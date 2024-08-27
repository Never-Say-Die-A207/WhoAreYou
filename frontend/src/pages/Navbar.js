import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userId, onLogout }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    //console.log("refreshToken : " + refreshToken);

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{ padding: 0 }}>
                <div className="container-fluid">
                    <Link to='/' className="navbar-brand">WHO ARE YOU</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                    <div>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to='/matching' className='nav-link'>매칭하기</Link>
                            </li>
                            {refreshToken &&
                            <li className="nav-item">
                                <Link to='/mypage' className='nav-link'>채팅하기</Link>
                            </li>
                            }
                            
                        </ul>
                        </div>
                        <div>
                        {/* refreshToken && 로그아웃 버튼 */}
                        {!refreshToken && <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to='/signup' className='nav-link' id='nav-signup'>회원가입</Link>
                            </li>
                        </ul>}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
