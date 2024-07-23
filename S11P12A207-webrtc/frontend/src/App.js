import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import OpenVidu from './components/openvidu/OpenVidu';


function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/matching' element={<OpenVidu />}/>
      </Routes>
    </div>
  );
}

export default App;
