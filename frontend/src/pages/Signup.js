import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Signup.css';
import './Modal.css'; // 추가된 스타일 파일 가져오기
import Agree from './Agree';
import Navbar from './Navbar';

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

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [agreements, setAgreements] = useState({
        chk_join_terms_fourteen: false,
        chk_join_terms_service: false,
        chk_join_terms_privacy_collect_use: false,
        chk_agree_to_collect_third_part_information: false,
    });

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
            }
        } catch (error) {
            if (error.response.data.code === 'DE') {
                setNicknameCheck('불가능');
            }
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== checkpassword) {
            setModalMessage('비밀번호가 일치하지 않습니다.');
            setShowModal(true);
            return;
        }

        if (emailCheck !== '가능') {
            setModalMessage('이메일을 확인하세요.');
            setShowModal(true);
            return;
        }
        if (nicknameCheck !== '가능') {
            setModalMessage('닉네임을 확인하세요.');
            setShowModal(true);
            return;
        }

        const requiredAgreements = ['chk_join_terms_fourteen', 'chk_join_terms_service', 'chk_join_terms_privacy_collect_use', 'chk_agree_to_collect_third_part_information'];
        const allRequiredAgreed = requiredAgreements.every(key => agreements[key]);

        if (!allRequiredAgreed) {
            setModalMessage('필수 동의 항목을 모두 체크해야 회원가입이 가능합니다.');
            setShowModal(true);
            return;
        }

        try {
            const response = await api.post('/sign-up', form);
            setModalMessage('회원가입이 완료되었습니다.');
            setShowModal(true);
            navigate('/');
        } catch (error) {
            console.error('Signup error:', error);
            setModalMessage('회원가입에 실패했습니다.');
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="login-page">
            <Navbar />
            <div className="layout-body login-page-view" data-lang="ko-KO">
                <div className="signup-container">
                    <h1 className="signup-title">회원가입</h1>
                    <div className="layout-main">
                        <div className="layout-main-slot">
                            <div className="form-width-sm">
                                <form className="zm-form zm-from--label-inline" onSubmit={onSubmit} style={{ width: '100%' }}>
                                    <div className="zm-form-item is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div className={`zm-input zm-input--xLarge ${email ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`} style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className='email_input'>
                                                    <input type="email" autoComplete="email" name="email" aria-required="true" aria-label="이메일 주소" id="email" maxLength="99" className="zm-input__inner email_input_input" value={email} onChange={onChange} />
                                                    {!email && (
                                                        <label htmlFor="email" className="zm-input__label email_label" style={{ transform: 'translate(-50%, -50%)' }}>
                                                            이메일 주소
                                                        </label>
                                                    )}
                                                </div>
                                                <button className='email_button' onClick={checkEmail}>
                                                    {emailCheck}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="zm-form-item zm-form-password is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div className={`zm-input zm-input--xLarge ${password ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`} style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className='password_div'>
                                                    <input type="password" autoComplete="password" name="password" aria-required="true" aria-label="비밀번호" id="password" maxLength="99" className="zm-input__inner password_input" value={password} onChange={onChange} />
                                                    {!password && (
                                                        <label htmlFor="password" className="zm-input__label password_label" style={{ transform: 'translate(-50%, -50%)' }}>
                                                            비밀번호
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="zm-form-item zm-form-password is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div className={`zm-input zm-input--xLarge ${password ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`} style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className='password_div'>
                                                    <input type="password" autoComplete="password" name="password" aria-required="true" aria-label="비밀번호확인" id="checkpassword" maxLength="99" className="zm-input__inner password_input" value={checkpassword} onChange={onCheck} />
                                                    {!checkpassword && (
                                                        <label htmlFor="checkpassword" className="zm-input__label password_label" style={{ transform: 'translate(-50%, -50%)' }}>
                                                            비밀번호확인
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="zm-form-item is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div className={`zm-input zm-input--xLarge ${nickname ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`} style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className='email_input'>
                                                    <input type="text" autoComplete="text" name="nickname" aria-required="true" aria-label="닉네임" id="nickname" maxLength="99" className="zm-input__inner email_input_input" value={nickname} onChange={onChange} />
                                                    {!nickname && (
                                                        <label htmlFor="nickname" className="zm-input__label email_label" style={{ transform: 'translate(-50%, -50%)' }}>
                                                            닉네임
                                                        </label>
                                                    )}
                                                </div>
                                                <button className='email_button' onClick={checkNickname}>
                                                    {nicknameCheck}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="zm-form-item is-no-asterisk">
                                        <div className="zm-form-item__content">
                                            <div className={`zm-input zm-input--xLarge ${nickname ? '' : 'is-empty'} zm-input--suffix zm-input--show-label`} style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className='email_input'>
                                                    <input type="text" autoComplete="text" name="name" aria-required="true" aria-label="이름" id="name" maxLength="99" className="zm-input__inner email_input_input" value={name} onChange={onChange} />
                                                    {!name && (
                                                        <label htmlFor="name" className="zm-input__label email_label" style={{ transform: 'translate(-50%, -50%)' }}>
                                                            이름
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', marginTop: '20px', fontSize:'1.3rem', fontWeight:'600', marginBottom:'1.5rem' }}>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" id="male" value="male" checked={gender === 'male'} onChange={onRadioChange} />
                                            <label className="form-check-label" htmlFor="male">
                                                남자
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" id="female" value="female" checked={gender === 'female'} onChange={onRadioChange} />
                                            <label className="form-check-label" htmlFor="female">
                                                여자
                                            </label>
                                        </div>
                                    </div>
                                    <Agree className="zm-form-item is-no-asterisk" onAgreeChange={(agreedStatus) => setAgreements(agreedStatus)} />
                                    <div className="mgt-sm" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button style={{ cursor: 'pointer', color: 'white', backgroundColor: '#aa4dcb', fontSize: '1.5rem', width: '100%', height: '50px', border: 'none', borderRadius: '5px', textAlign: 'center' }} onMouseOver={(e) => (e.target.style.backgroundColor = '#8530e9')} onMouseOut={(e) => (e.target.style.backgroundColor = '#aa4dcb')} type="submit">
                                            회원가입
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="form-width-sm form-group re-captcha" style={{ fontSize: '14px' }}></div>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="my-overlay"> {/* 오버레이 스타일 적용 */}
                    <div className="my-modal"> {/* 모달 스타일 적용 */}
                        <h2>회원가입 오류</h2>
                        <p>{modalMessage}</p>
                        <button className="close" onClick={closeModal}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
