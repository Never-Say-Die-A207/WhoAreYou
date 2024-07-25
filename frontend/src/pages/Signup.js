import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../api/api';

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        name: '',
        nickname: '',
        password: '',
        checkpassword: '',
        gender: '',
    });
    const [emailCheck, setEmailCheck] = useState('중복확인');
    const [nicknameCheck, setNicknameCheck] = useState('중복확인');
    const [passwordMatch, setPasswordMatch] = useState(null);

    const { email, name, nickname, password, checkpassword, gender } = form;

    const onChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        console.log(id, value)
        setForm({
            ...form,
            [id]: value
        });

        if (id === 'checkpassword') {
            setPasswordMatch(value === form.password);
        }
    };

    const onRadioChange = (e) => {
        const value = e.target.value;
        console.log(value)
        setForm({
            ...form,
            gender: value
        });
    };

    const checkEmail = async () => {
        const emailForm = {
            email
        };
        try {
            const response = await api.post('/email-check', emailForm);
            console.log('Email Check api:', response.data);
            if (response.data.code == 'SU') {
                setEmailCheck('가능');
            } else {
                setEmailCheck('불가능');
            };
        } catch (error) {
            console.error('Email Check api error:', error);
        };
    };

    const checkNickname = async () => {
        const nicknameForm = {
            nickname
        };
        try {
            const response = await api.post('/nickname-check', nicknameForm);
            console.log('Nickname Check api:', response.data);
            if (response.data.code == 'SU') {
                setNicknameCheck('가능');
            } else {
                setNicknameCheck('불가능');
            };
        } catch (error) {
            console.error('Nickname Check api error:', error);
        };
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

    const goBack = () => {
        navigate(-1);
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <h1>회원가입</h1>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div>
                    <label htmlFor='email'>이메일</label>
                    <input type='email' id='email' value={email} onChange={onChange}></input>
                    <button onClick={checkEmail}>{emailCheck}</button>
                </div>
                <div>
                    <label htmlFor='name'>이름</label>
                    <input type='text' id='name' value={name} onChange={onChange}></input>
                </div>
                <div>
                    <label htmlFor='nickname'>닉네임</label>
                    <input type='text' id='nickname' value={nickname} onChange={onChange}></input>
                    <button onClick={checkNickname}>{nicknameCheck}</button>
                </div>
                <div>
                    <label htmlFor='password'>비밀번호</label>
                    <input type='password' id='password' value={password} onChange={onChange}></input>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label htmlFor='checkpassword'>비밀번호 확인</label>
                    <input type='password' id='checkpassword' value={checkpassword} onChange={onChange}></input>
                    {passwordMatch !== null && (
                        <p
                            style={{
                                color: passwordMatch ? 'blue' : 'red',
                                opacity: 0.5,
                                fontSize: '0.9rem',
                                margin: 0
                            }}
                        >
                            {passwordMatch ? '일치' : '불일치'}
                        </p>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label htmlFor='radio'>성별</label>
                    <div id='radio' style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                        <p style={{ margin: 0 }}>
                            <input type='radio' id='gender' value='male' checked={gender === 'male'} onChange={onRadioChange} />
                            남
                        </p>
                        <p style={{ margin: 0 }}>
                            <input type='radio' id='gender' value='female' checked={gender === 'female'} onChange={onRadioChange} />
                            여
                        </p>
                    </div>
                </div>
                <div>
                    <button type='submit'>회원가입</button>
                    <button onClick={goBack}>뒤로가기</button>
                </div>
            </form>
        </div>
    );
};

export default Signup;