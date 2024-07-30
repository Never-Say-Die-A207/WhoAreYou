import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Signup.css'; // 커스터마이징된 CSS를 추가합니다.

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
        checkpassword: '',
    });

    const [showModal, setShowModal] = useState(false); // 모달 상태 추가

    const { email, name, nickname, password, gender } = form;
    const { checkpassword } = passwordMatch;

    const onChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        setForm({
            ...form,
            [id]: value,
        });
    };

    const onCheck = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        setPasswordMatch({
            [id]: value,
        });
    };

    const onRadioChange = (e) => {
        const value = e.target.value;
        setForm({
            ...form,
            gender: value,
        });
    };

    const checkEmail = async (e) => {
        e.preventDefault();
        const emailForm = { email };
        try {
            const response = await api.post('/email-check', emailForm);
            if (response.data.code === 'SU') {
                setEmailCheck('가능');
            }
        } catch (error) {
            if (error.response.data.code === 'DE') {
                setEmailCheck('불가능');
            }
        }
    };

    const checkNickname = async (e) => {
        e.preventDefault();
        const nicknameForm = { nickname };
        try {
            const response = await api.post('/nickname-check', nicknameForm);
            if (response.data.code === 'SU') {
                setNicknameCheck('가능');
            } else {
                setNicknameCheck('불가능');
            }
        } catch (error) {
            console.error('Nickname Check api error:', error);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== checkpassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            const response = await api.post('/sign-up', form);
            navigate('/');
        } catch (error) {
            console.error('Signup error:', error);
            // 회원가입 실패 시 모달 표시
            setShowModal(true);
        }
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="login-page">
            <div className="layout-body login-page-view" data-lang="ko-KO">
                <div className="signup-container">
                    <h1 className="signup-title">회원가입</h1>
                    <div className="layout-main">
                        <div className="layout-main-slot">
                            <div className="form-width-sm">
                                <form
                                    className="zm-form zm-from--label-inline"
                                    onSubmit={onSubmit}
                                >
                                    <div className="zm-form-item is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div
                                                className={`zm-input zm-input--xLarge ${
                                                    email ? '' : 'is-empty'
                                                } zm-input--suffix zm-input--show-label`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div className='email_input'>
                                                    <input
                                                        type="email"
                                                        autoComplete="email"
                                                        name="email"
                                                        placeholder="이메일 주소"
                                                        aria-required="true"
                                                        aria-label="이메일 주소"
                                                        id="email"
                                                        maxLength="99"
                                                        className="zm-input__inner email_input_input"
                                                        value={email}
                                                        onChange={onChange}
                                                    
                                                    />
                                                    {!email && (
                                                        <label
                                                            htmlFor="email"
                                                            className="zm-input__label email_label"
                                                            style={{
                    
                                                                transform:
                                                                    'translate(-50%, -50%)',
                                                            }}
                                                        >
                                                            이메일 주소
                                                        </label>
                                                    )}
                                                </div>
                                                <button className='email_button'
                                                    onClick={checkEmail}
                                            
                                                >
                                                    {emailCheck}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="zm-form-item zm-form-password is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div
                                                className={`zm-input zm-input--xLarge ${
                                                    password ? '' : 'is-empty'
                                                } zm-input--suffix zm-input--show-label`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div className='password_div'
                    
                                                >
                                                    <input
                                                        type="password"
                                                        autoComplete="password"
                                                        name="password"
                                                        placeholder="비밀번호"
                                                        aria-required="true"
                                                        aria-label="비밀번호"
                                                        id="password"
                                                        maxLength="99"
                                                        className="zm-input__inner password_input"
                                                        value={password}
                                                        onChange={onChange}
                                                
                                                    />
                                                    {!password && (
                                                        <label
                                                            htmlFor="password"
                                                            className="zm-input__label password_label"
                                                            style={{
                                                             
                                                                transform:
                                                                    'translate(-50%, -50%)'
                                                               
                                                            }}
                                                        >
                                                            비밀번호
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="zm-form-item zm-form-password is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div
                                                className={`zm-input zm-input--xLarge ${
                                                    password ? '' : 'is-empty'
                                                } zm-input--suffix zm-input--show-label`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div className='password_div'
                                            
                                                >
                                                    <input
                                                        type="password"
                                                        autoComplete="password"
                                                        name="password"
                                                        placeholder="비밀번호확인"
                                                        aria-required="true"
                                                        aria-label="비밀번호확인"
                                                        id="checkpassword"
                                                        maxLength="99"
                                                        className="zm-input__inner password_input"
                                                        value={checkpassword}
                                                        onChange={onCheck}
                                                
                                                    />
                                                    {!checkpassword && (
                                                        <label
                                                            htmlFor="checkpassword"
                                                            className="zm-input__label password_label"
                                                            style={{
                                
                                                                transform:
                                                                    'translate(-50%, -50%)',
                                                            }}
                                                        >
                                                            비밀번호확인
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="zm-form-item is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div
                                                className={`zm-input zm-input--xLarge ${
                                                    nickname ? '' : 'is-empty'
                                                } zm-input--suffix zm-input--show-label`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div className='email_input'>
                                                    <input
                                                        type="text"
                                                        autoComplete="text"
                                                        name="nickname"
                                                        placeholder="닉네임"
                                                        aria-required="true"
                                                        aria-label="닉네임"
                                                        id="nickname"
                                                        maxLength="99"
                                                        className="zm-input__inner email_input_input"
                                                        value={nickname}
                                                        onChange={onChange}
                                    
                                                    />
                                                    {!nickname && (
                                                        <label
                                                            htmlFor="nickname"
                                                            className="zm-input__label email_label"
                                                            style={{
                                                              
                                                                transform:
                                                                    'translate(-50%, -50%)',
                                                            }}
                                                        >
                                                            닉네임
                                                        </label>
                                                    )}
                                                </div>
                                                <button
                                                    className='email_button'
                                                    onClick={checkNickname}
                                                 
                                                >
                                                    {nicknameCheck}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="zm-form-item is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div
                                                className={`zm-input zm-input--xLarge ${
                                                    nickname ? '' : 'is-empty'
                                                } zm-input--suffix zm-input--show-label`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div className='email_input'
                                              
                                                >
                                                    <input
                                                        type="text"
                                                        autoComplete="text"
                                                        name="name"
                                                        placeholder="이름"
                                                        aria-required="true"
                                                        aria-label="이름"
                                                        id="name"
                                                        maxLength="99"
                                                        className="zm-input__inne email_input_input"
                                                        value={name}
                                                        onChange={onChange}
                                                        style={{
                                                            width: '100%',
                                                            height: '50px',
                                                            boxSizing:
                                                                'border-box',
                                                            paddingRight:
                                                                '10px',
                                                            fontSize: '1rem',
                                                        }}
                                                    />
                                                    {!name && (
                                                        <label
                                                            htmlFor="name"
                                                            className="zm-input__label"
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform:
                                                                    'translate(-50%, -50%)',
                                                                color: '#999', // 적절한 색상을 지정하세요
                                                            }}
                                                        >
                                                            이름
                                                        </label>
                                                    )}
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginTop: '20px',
                                        }}
                                    >
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                id="male"
                                                value="male"
                                                checked={gender === 'male'}
                                                onChange={onRadioChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="male"
                                            >
                                                남자
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                id="female"
                                                value="female"
                                                checked={gender === 'female'}
                                                onChange={onRadioChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="female"
                                            >
                                                여자
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mgt-sm">
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
                                                textAlign: 'center',
                                            }}
                                            onMouseOver={(e) =>
                                                (e.target.style.backgroundColor =
                                                    '#8530e9')
                                            }
                                            onMouseOut={(e) =>
                                                (e.target.style.backgroundColor =
                                                    '#aa4dcb')
                                            }
                                            type="submit" // 변경: onClick에서 type="submit"으로 수정
                                        >
                                            회원가입
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div
                                className="form-width-sm form-group re-captcha"
                                style={{ fontSize: '14px' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모달 */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>회원가입 실패</h2>
                        <p>회원가입에 실패했습니다.</p>
                        <button onClick={closeModal}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
