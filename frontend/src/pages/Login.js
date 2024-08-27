import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import Naver from './Naver';
import { jwtDecode } from 'jwt-decode';
import './Modal.css';


const Login = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { email, password } = form;

    const onChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;

        setForm({
            ...form,
            [id]: value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/sign-in', form);
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('accessTokenExpirationTime', response.data.accessTokenExpirationTime);

            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('refreshTokenExpirationTime', response.data.refreshTokenExpirationTime);
            //console.log('Login success:', response.data);

            // JWT 토큰 받아오기
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;

            // 토큰 디코딩
            const decodedAccessToken = jwtDecode(accessToken);

            // userId 추출
            const userId = decodedAccessToken.sub;

            localStorage.setItem('userId', userId);
            //localStorage.setItem('accessToken', accessToken);

            // 사용자 정보를 가져오기
            const userResponse = await api.get(`/user/${userId}`);
            localStorage.setItem('nickname', userResponse.data['nickname']);

            navigate('/matching');
        } catch (error) {
            console.error('Login error:', error);
            if(error.response.data.code === "ASI"){
                setModalMessage('이미 로그인 중인 사용자입니다.');
            }
            else{
                setModalMessage('아이디와 비밀번호를 확인해 주세요.');
            }
            setShowModal(true); // 로그인 실패 시 모달을 표시
        }
    };


    const inputStyle = {
        paddingLeft: '10px',
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className='login-page'>
            <div className='layout-body login-page-view' data-lang='ko-KO'>
                <div className='layout-main'>

                    <div className='form-width-sm'>
                        <form action='javascript:;' className='zm-form zm-form--label-inline'>
                            <div className='zm-form-item is-no-asterisk'>
                                <div className='zm-form-item__content'>
                                    <div className={`zm-input zm-input--xLarge ${email ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`}>
                                        <input
                                            type='email'
                                            autoComplete='email'
                                            name='email'
                                            placeholder="이메일 주소"
                                            aria-required='true'
                                            aria-label='이메일 주소'
                                            id='email'
                                            maxLength='99'
                                            className='zm-input__inner'
                                            value={email}
                                            onChange={onChange}
                                            style={inputStyle}
                                        />

                                        <span className='zm-input__suffix'>
                                            <span className='zm-input__suffix-inner'></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='zm-form-item zm-form-password is-no-asterisk'>
                                <div className='zm-form-item__content'>
                                    <div className={`zm-input zm-input--xLarge ${password ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`}>
                                        <input
                                            type='password'
                                            autoComplete='password'
                                            name='password'
                                            placeholder="비밀번호"
                                            aria-required='true'
                                            aria-label='비밀번호'
                                            id='password'
                                            maxLength='99'
                                            className='zm-input__inner'
                                            value={password}
                                            onChange={onChange}
                                            style={inputStyle}
                                        />

                                        <span className='zm-input__suffix'>
                                            <span className='zm-input__suffix-inner'>
                                                <button type='button' aria-label='show password' className='zm-input__password-btn zm-input__icon zm-icon-eyes zm-input__clear'></button>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='mgt-sm'>
                                <div style={{ paddingTop: '30px', }}>
                                    <button
                                        style={{
                                            cursor: 'pointer',
                                            color: 'white',
                                            backgroundColor: '#aa4dcb',
                                            fontSize: '1.2rem',
                                            width: '50%',
                                            // height: '50px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            padding: '10px'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(150, 60, 180)'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#aa4dcb'}
                                        onClick={onSubmit}
                                    >
                                        로그인
                                    </button>
                                </div>
                                <p id='agree-terms' className='agree-terms mgt-md'>
                                    "나는 로그인함으로써 <br></br>who are you? 개인정보 처리방침 및 이용 약관에 동의합니다."
                                </p>
                            </div>
                        </form>
                    </div>
                    <hr></hr>
                    <div className='form-width-sm'>
                        <div className='zm-login-methods form-width'>
                            <p id='js_ride_methods_title' className='zm-login-methods__title'>
                                <span> 또는 다음으로 로그인</span>
                            </p>
                            <div className='zm-login-methods__list justify-between'>
                                <Naver />
                            </div>
                        </div>
                    </div>
                    <div className='form-width-sm form-group re-captcha' style={{ fontSize: '14px' }}></div>

                </div>
            </div>
            {showModal && (
                <div className="my-overlay">
                    <div className="my-modal">
                        <h2 style={{ color: 'white', marginBottom: '20px' }}><strong>로그인 오류</strong></h2>
                        <div className="my-info-content">
                            <div className="info-box" style={{ justifyContent: 'center' }}>
                                <p>{modalMessage}</p>
                            </div>
                        </div>
                        <button className="close" onClick={closeModal}>확인</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Login;