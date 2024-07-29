import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header>

      <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom border-body">
        <div class="container-fluid">
          <Link to='/' style={{ marginRight: '20px' }} className="navbar-brand">WHO ARE YOU</Link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link to='/' style={{ marginRight: '20px' }} className="nav-link" aria-current="page">홈</Link>
              </li>
              <li class="nav-item">
                <Link to='/signup' style={{ marginRight: '20px' }} className='nav-link'>회원가입</Link>
              </li>
              <li class="nav-item">
                <Link to='/matching' style={{ marginRight: '20px' }} className='nav-link'>매칭하기</Link>
              </li>
              <li class="nav-item">
                <Link to='/mypage' className='nav-link'>마이페이지</Link>
              </li>
            </ul>
          </div>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;