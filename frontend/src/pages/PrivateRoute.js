import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('로그인을 해주세요.');
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
