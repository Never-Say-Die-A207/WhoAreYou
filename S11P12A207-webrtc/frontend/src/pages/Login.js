import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import Naver from './Naver';
// jwt-decode 라이브러리 가져오기
import { jwtDecode } from 'jwt-decode';



const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });



    const { email, password } = form;

    const onChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;

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
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('expirationTime', response.data.expirationTime);
            console.log('Login success:', response.data);
            // 예시: 프론트엔드에서 받은 JWT 토큰
            const token = response.data.token;

            // 토큰 디코딩
            const decodedToken = jwtDecode(token);

            // userId 추출
            const userId = decodedToken.sub;

            localStorage.setItem('userId', userId)

            navigate('/matching');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const inputStyle = {
        paddingLeft: '10px',  // Example padding value
    };

    return (
        <div className='login-page'>
            <div className='layout-body login-page-view' data-lang='ko-KO'>
                <div className='layout-main'>

                    <div className='form-width-sm'>
                        <form action='javascript:;' className='zm-form zm-from--label-inline'>
                            <div className='zm-form-item is-no-asterisk'>
                                <div className='zm-form-item__content'>
                                    <div className={`zm-input zm-input--xLarge ${email ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`}>
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
                                            style={inputStyle}  // Add style here
                                        />
                                        {!email && <label htmlFor='email' className='zm-input__label'>이메일 주소</label>}
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
                                            placeholder
                                            aria-required='true'
                                            aria-label='비밀번호'
                                            id='password'
                                            maxLength='99'
                                            className='zm-input__inner'
                                            value={password}
                                            onChange={onChange}
                                            style={inputStyle}  // Add style here
                                        />
                                        {!password && <label htmlFor='password' className='zm-input__label'>비밀번호</label>}
                                        <span className='zm-input__suffix'>
                                            <span className='zm-input__suffix-inner'>
                                                <button type='button' aria-label='show password' className='zm-input__password-btn zm-input__icon zm-icon-eyes zm-input__clear'></button>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='login-function-box mgb-md'>
                                    <button type="button" className="zm-btn-forgot pdt-0 pdb-0 zm-button--link zm-button--small zm-button">
                                        <span className="zm-button__slot"> 비밀번호를 잊어버렸나요? </span>
                                    </button>
                                    <button type="button" className="zm-button--link zm-button--small zm-button" aria-label="Get help from Chat with Bot">
                                        <span className="zm-button__slot"> 도움말 </span>
                                    </button>
                                </div> */}
                            <div className='mgt-sm'>
                                <div style={{ paddingTop: '30px', }}>
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
                                        로그인
                                    </button>
                                </div>
                                <p id='agree-terms' className='agree-terms mgt-md'>
                                    "나는 로그인함으로써 who are you? 개인정보 처리방침 및 이용 약관에 동의합니다."
                                </p>
                                <div>
                                    <span className='zm-checkbox mgt-sm' role='application'>
                                        <span className='zm-checkbox__wrap'>
                                            <label className='zm-checkbox_label is disabled'>
                                                <input type='checkbox' id='checkbox_0' aria-checked='false' tabIndex='0' className='zm-checkbox__original' value='false' disabled='disabled'></input>
                                                <span className='zm-checkbox__inner'>
                                                    <i className='zm-checkbox__knob'></i>
                                                </span>
                                                <span className='zm-checkbox__label-inner'>
                                                    로그인 상태를 유지합니다.
                                                </span>
                                            </label>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
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
        </div>
    );
};

export default Login;
