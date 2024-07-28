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
        <div className='login-page'>
            {/* <header className='layout-header'>
                <h1>who are you?</h1>
            </header> */}
            <div className='layout-body login-page-view' data-lang='ko-KO'>
                {/* <div className='layout-aside'>
                    <img src={mainimg} alt="Main" />
                </div> */}
                <div className='layout-main'>
                    <div className='layout-main-slot'>
                        <div className='form-width-sm'>
                            <form action='javascript:;' className='zm-form zm-from--label-inline'>
                                <div className='zm-form-item is-no-asterisk'>
                                    
                                    <div className='zm-form-item__content'>
                                       
                                        <div className='zm-input zm-input--xLarge is-empty zm-input--show-label'>
                                            <input type='email' autoComplete='email' name='email' placeholder aria-required='true' aria-label='이메일 주소' id='email' maxLength='128' className='zm-input__inner'></input>
                                            <label for='email' className='zm-input__label'>이메일 주소</label>
                                            <span className='zm-input__suffix'>
                                                <span className='zm-input__suffix-inner'></span>
                                            </span>
                                        </div>
                                    
                                    </div>
                                  
                                </div>
                                <div className='zm-form-item zm-form-password is-no-asterisk'>
                                    <div className='zm-form-item__content'>
                                        <div className='zm-input zm-input--xLarge is-empty zm-input--suffix zm-input--show-label'>
                                            <input type='password' autoComplete='password' name='password' placeholder aria-required='true' aria-label='비밀번호' id='password' maxLength='99' className='zm-input__inner'></input>
                                            <label for='password' className='zm-input__label'>비밀번호</label>
                                            <span className='zm-input__suffix'>
                                                <span className='zm-input__suffix-inner'>
                                                    <button type='button' aria-label='show password' className='zm-input__password-btn zm-input__icon zm-icon-eyes zm-input__clear'></button>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <button
                    
                                    style={{
                                        cursor: 'pointer',
                                        color: 'white',
                                        backgroundColor: '#87CEFA',
                                        fontSize: '1.5rem',
                                        width: '200px',
                                        height: '50px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        textAlign: 'center'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#6CA0DC'} // 호버 적용
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#87CEFA'} // 호버 해제
                                >
                                    로그인
                                </button>
                                </div>
                                <div className='login-function-box mgb-md'>
                                    <button type="button" class="zm-btn-forgot pdt-0 pdb-0 zm-button--link zm-button--small zm-button">
                                        <span class="zm-button__slot"> 비밀번호를 잊어버렸나요? </span>
                                    </button>
                                    <button type="button" class="zm-button--link zm-button--small zm-button" aria-label="Get help from Chat with Bot">
                                        <span class="zm-button__slot"> 도움말 </span>
                                    </button>
                                </div>
                                <div className='mgt-sm'></div>
                            </form>
                        </div>
                        <div className='form-width-sm'></div>
                        <div className='form-width-sm form-group re-captcha' style={{ fontSize: '14px'}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;