import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../api/api';

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        nickname: '',
        password: '',
        checkpassword: '',
        gender: '',
    });

    const { email, nickname, password, checkpassword, gender } = form;

    const onChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        console.log(id, value)
        setForm({
            ...form,
            [id]: value
        });
    };

    const onRadioChange = (e) => {
        const value = e.target.value;
        console.log(value)
        setForm({
            ...form,
            gender: value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/sign-up', form);
            console.log('Signup success:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <h1>회원가입</h1>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <label htmlFor='email'>아이디</label>
                <input type='email' id='email' value={email} onChange={onChange}></input>
                <label htmlFor='nickname'>닉네임</label>
                <input type='text' id='nickname' value={nickname} onChange={onChange}></input>
                <label htmlFor='password'>비밀번호</label>
                <input type='password' id='password' value={password} onChange={onChange}></input>
                <label htmlFor='checkpassword'>비밀번호 확인</label>
                <input type='password' id='checkpassword' value={checkpassword} onChange={onChange}></input>
                <label htmlFor='radio'>성별</label>
                <div id='radio' style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <p style={{ margin: 0 }}>
                        <input type='radio' id='gender' value='남' checked={gender === '남'} onChange={onRadioChange} />
                        남
                    </p>
                    <p style={{ margin: 0 }}>
                        <input type='radio' id='gender' value='여' checked={gender === '여'} onChange={onRadioChange} />
                        여
                    </p>
                </div>
                <button type='submit'>회원가입</button>
            </form>
        </div>
    );
};

export default Signup;