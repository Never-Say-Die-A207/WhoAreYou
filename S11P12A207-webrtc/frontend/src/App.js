import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OpenVidu from './components/openvidu/OpenVidu';


function App() {
  return (
    <div className='App'>
      <nav>
        <Link to='/'>Home</Link> {'  '}
        <Link to='/login'>Login</Link> {'  '}
        <Link to='/signup'>Signup</Link> {'  '}
        <Link to='/matching'>Matching</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/matching' element={<OpenVidu />}/>
      </Routes>
    </div>
  );
}

export default App;
