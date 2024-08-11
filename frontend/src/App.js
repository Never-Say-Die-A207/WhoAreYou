import { React, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Mypage from './pages/Mypage';
import OpenVidu from './components/openvidu/OpenVidu';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Naver from './pages/Naver';
import PrivateRoute from './pages/PrivateRoute';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path='/mypage'
          element={
            <PrivateRoute>
              <Mypage />
            </PrivateRoute>
          }
        />
        <Route path='/matching' element={<OpenVidu />}/>
        <Route path="/" element={<Naver />} />
        <Route path="/auth/oauth-response/:token/:expiry" element={<Naver />} />
      </Routes>
    </div>
  );
}

export default App;
