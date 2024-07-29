import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Mypage from './pages/Mypage';
import OpenVidu from './components/openvidu/OpenVidu';
// index.js 또는 App.js 파일 상단에 추가
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {
  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/matching' element={<OpenVidu />}/>
        <Route path='/mypage' element={<Mypage />} />
      </Routes>
    </div>
  );
}

export default App;
