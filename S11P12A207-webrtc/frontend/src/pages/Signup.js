import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../api/api';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        name: '',
        nickname: '',
        password: '',
        gender: '',
    });
    const [emailCheck, setEmailCheck] = useState('중복확인');
    const [nicknameCheck, setNicknameCheck] = useState('중복확인');
    const [passwordMatch, setPasswordMatch] = useState({
        checkpassword: ''
    });

    const { email, name, nickname, password, gender } = form;
    const { checkpassword } = passwordMatch;

    const onChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        console.log(id, value)
        setForm({
            ...form,
            [id]: value
        });
    };

    const onCheck = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        console.log(id, value)
        setPasswordMatch({
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

    const checkEmail = async (e) => {
        e.preventDefault();
        const emailForm = {
            email
        };
        try {
            const response = await api.post('/email-check', emailForm);
            if (response.data.code == 'SU') {
                setEmailCheck('가능');
            };
        } catch (error) {
            if (error.response.data.code == 'DE') {
                setEmailCheck('불가능');
            }
            else {
                console.log('Email Check api error:', error)
            }
        };
    };

    const checkNickname = async (e) => {
        e.preventDefault();
        const nicknameForm = {
            nickname
        };
        try {
            const response = await api.post('/nickname-check', nicknameForm);
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
        
        <div className='login-page'>
            <h1>회원가입</h1>
            <div className='layout-body login-page-view' data-lang='ko-KO'>
                <div className='layout-main'>
                    <div className='layout-main-slot'>
                        <div className='form-width-sm'>
                            <form action='javascript:;' className='zm-form zm-from--label-inline' onSubmit={onSubmit}>
                                <div className='zm-form-item is-no-asterisk'>
                                    <div className='zm-form-item__content'>
                                        
                                    <div className={`zm-input zm-input--xLarge ${email ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ position: 'relative', flex: '1' }}>
                                            <input
                                                type='email'
                                                autoComplete='email'
                                                name='email'
                                                placeholder
                                                aria-required='true'
                                                aria-label='이메일 주소'
                                                id='email'
                                                maxLength='99'
                                                className='zm-input__inner'
                                                value={email}
                                                onChange={onChange}
                                                style={{ width: '100%', height: '100%', boxSizing: 'border-box', paddingRight: '10px' }}
                                            />
                                            {!email && (
                                                <label
                                                    htmlFor='email'
                                                    className='zm-input__label'
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        color: '#999' // 적절한 색상을 지정하세요
                                                    }}
                                                >
                                                    이메일 주소
                                                </label>
                                            )}
                                        </div>
                                        <button onClick={checkEmail}
                                            style={{
                                                color: 'white',
                                                backgroundColor: '#aa4dcb'
                                            }}
                                        >{emailCheck}</button>
                                    </div>

                                    </div>
                                </div>
                                <div className='zm-form-item zm-form-password is-no-asterisk'>
                                    <div className='zm-form-item__content'>
                                    <div className={`zm-input zm-input--xLarge ${password ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ position: 'relative', width: '100%' }}>
                                            <input
                                                type='password'
                                                autoComplete='password'
                                                name='password'
                                                placeholder
                                                aria-required='true'
                                                aria-label='비밀번호'
                                                id='password'
                                                maxLength='99'
                                                className='zm-input__inner'
                                                value={password}
                                                onChange={onChange}
                                                style={{ width: '100%', height: '40px', boxSizing: 'border-box', padding: '0 10px' }}
                                            />
                                            {!password && (
                                                <label
                                                    htmlFor='password'
                                                    className='zm-input__label'
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        pointerEvents: 'none', // 사용자 입력 불가능하도록
                                                        color: '#999' // 적절한 색상을 지정하세요
                                                    }}
                                                >
                                                    비밀번호
                                                </label>
                                            )}
                                        </div>
                                    </div>



                                    </div>
                                </div>
                                <div className='zm-form-item zm-form-password is-no-asterisk'>
                                    <div className='zm-form-item__content'>
                                    <div className={`zm-input zm-input--xLarge ${password ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ position: 'relative', width: '100%' }}>
                                            <input
                                                type='password'
                                                autoComplete='password'
                                                name='password'
                                                placeholder
                                                aria-required='true'
                                                aria-label='비밀번호확인'
                                                id='checkpassword'
                                                maxLength='99'
                                                className='zm-input__inner'
                                                value={checkpassword}
                                                onChange={onCheck}
                                                style={{ width: '100%', height: '40px', boxSizing: 'border-box', padding: '0 10px' }}
                                            />
                                            {!checkpassword && (
                                                <label
                                                    htmlFor='checkpassword'
                                                    className='zm-input__label'
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        pointerEvents: 'none', // 사용자 입력 불가능하도록
                                                        color: '#999' // 적절한 색상을 지정하세요
                                                    }}
                                                >
                                                    비밀번호확인
                                                </label>
                                            )}
                                        </div>
                                    </div>



                                    </div>
                                </div>
                    
                                <div className='mgt-sm'>
                                        <button
                                            style={{
                                                cursor: 'pointer',
                                                color: 'white',
                                                backgroundColor: '#aa4dcb',
                                                fontSize: '1.5rem',
                                                width: '200px',
                                                height: '50px',
                                                border: 'none',
                                                borderRadius: '5px',
                                                textAlign: 'center'
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#8530e9'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = '#aa4dcb'}
                                            onClick={onSubmit}
                                        >
                                            회원가입
                                        </button>
                                    <div style={{ paddingTop: '30px', }}>
                                    </div>
                             
                                </div>
                            </form>
                        </div>
               
                        <div className='form-width-sm form-group re-captcha' style={{ fontSize: '14px' }}></div>
                    </div>
                </div>
            </div>
        </div>

                 


     
    );
};

export default Signup;