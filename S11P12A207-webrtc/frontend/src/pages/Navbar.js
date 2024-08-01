import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './Navbar.css';
import './Modal.css'
import MyInfo from './MyInfo';


Modal.setAppElement('#root');

const Navbar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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
              {/* <li className="nav-item">
                <Link to='/' className="nav-link">홈</Link>
              </li> */}
              {/* <li className="nav-item">
                <Link to='/signup' className='nav-link'>회원가입</Link>
              </li> */}
              <li className="nav-item">
                <Link to='/matching' className='nav-link'>매칭하기</Link>
              </li>
              <li className="nav-item">
                <Link to='/mypage' className='nav-link'>마이페이지</Link>
              </li>
              <li className="nav-item">
                <button onClick={openModal} className='nav-link btn btn-link'>내정보</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="My Info Modal"
        className="my-modal"
        overlayClassName="my-overlay"
      >
        <MyInfo onClose={closeModal} />
      </Modal>
    </header>
  );
};

export default Navbar;
