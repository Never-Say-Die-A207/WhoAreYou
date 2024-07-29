import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const { email, password } = form;

    const onChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        console.log(id, value)
        
        setForm({
            ...form,
            [id]: value
        });
    };

    const onLogin = () => {
        navigate('/signup');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/sign-in', form);
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log('Login success:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h1>로그인</h1>
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <label htmlFor='email'>아이디</label>
                    <input type='email' id='email' value={email} onChange={onChange} placeholder='아이디를 입력하세요.'></input>
                    <label htmlFor='password'>비밀번호</label>
                    <input type='password' id='password' value={password} onChange={onChange} placeholder='비밀번호를 입력하세요.'></input>
                    <button type='submit'>로그인</button>
                </form>
                <button onClick={onLogin}>회원가입</button>
            </div>
        </div>
    );
};

export default Login;