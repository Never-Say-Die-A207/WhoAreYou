import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header style={{ padding: '20px', backgroundColor: '#f8f8f8', borderBottom: '1px solid #ccc' }}>
      <nav>
        <Link to='/' style={{ marginRight: '20px' }}>홈</Link>
        <Link to='/signup' style={{ marginRight: '20px' }}>회원가입</Link>
        <Link to='/matching' style={{ marginRight: '20px' }}>매칭하기</Link>
        <Link to='/mypage'>마이페이지</Link>
      </nav>
    </header>
  );
};

export default Navbar;
