import React, { useState } from 'react';
import './Agree.css';
import './Modal.css';
import iconImage from '../assets/icon.png';

const Agree = ({ onAgreeChange }) => {
    const [agreed, setAgreed] = useState(false);
    const [individualAgreements, setIndividualAgreements] = useState({
        chk_join_terms_fourteen: false,
        chk_join_terms_service: false,
        chk_join_terms_privacy_collect_use: false,
        chk_agree_to_collect_third_part_information: false,
        chk_POLICY_AGREE_COLLECT: false,
        chk_agree_to_receive_ads: false,
        chk_POLICY_AGREE_EMAIL: false,
        chk_POLICY_AGREE_SMS: false,
        chk_POLICY_AGREE_PUSH: false,
    });

    const handleCheckboxChange = () => {
        const newAgreedState = !agreed;
        setAgreed(newAgreedState);
        setIndividualAgreements(state => {
            const newState = {};
            for (let key in state) {
                newState[key] = newAgreedState;
            }
            onAgreeChange(newState); 
            return newState;
        });
    };

    const handleIndividualCheckboxChange = (id) => {
        setIndividualAgreements(state => {
            const newState = { ...state, [id]: !state[id] };
            const allAgreed = Object.values(newState).every(value => value);
            setAgreed(allAgreed);
            onAgreeChange(newState); 
            return newState;
        });
    };


    const [showModal, setShowModal] = useState(false);

    const agreeModal = () => {
        setShowModal(true);
    };

    const [financeModal, setFinanceModal] = useState(false);

    const financeOpenModal = () => {
        setFinanceModal(true);
    };
    const closeFinanceModal = () => {
        setFinanceModal(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div id='c-jointerms' className='jointerms'>
            <div className='g-terms-checkbox'>
                <div className='checkall checkall-first'>
                    <div id='c-checkbox-item_checkall' className='c-checkbox_item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_checkall'
                                onChange={handleCheckboxChange}
                                checked={agreed}
                                aria-hidden='true' 
                            />
                            <label htmlFor='chk_checkall' role='checkbox' aria-label='모두 확인하였으며 동의합니다.' aria-checked={agreed}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>모두 확인하였으며 동의합니다.</span>
                            </label>
                        </div>
                    </div>
                    <span className='message'>
                        "전체 동의에는 필수 및 선택 정보에 대한 동의가 포함되어 있으며, 개별적으로 동의를 선택하실 수 있습니다. 선택 항목에 대한 동의를 거부하시는 경우에도 서비스 이용이 가능합니다."
                    </span>
                </div>
                <div className='error-tip'></div>
                <ul className='terms'>
                    {/* Your other list items */}
                    <li className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_join_terms_service'
                                onChange={() => handleIndividualCheckboxChange('chk_join_terms_service')}
                                checked={individualAgreements.chk_join_terms_service}
                                aria-hidden='true'
                            />
                            <label htmlFor='chk_join_terms_service' role='checkbox' aria-label='WHO ARE YOU 이용약관 동의' aria-checked={individualAgreements.chk_join_terms_service}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>[필수] WHO ARE YOU 이용약관 동의</span>
                            </label>
                            <div>
                                <button style={{ height:'15px', width:'15px', backgroundColor:'rgb(170, 77, 203)' }} onClick={agreeModal}>
                                    
                                </button>

                                
                            </div>
                        </div>
                    </li>
                    <li className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_join_terms_privacy_collect_use'
                                onChange={() => handleIndividualCheckboxChange('chk_join_terms_privacy_collect_use')}
                                checked={individualAgreements.chk_join_terms_privacy_collect_use}
                                aria-hidden='true'
                            />
                            <label htmlFor='chk_join_terms_privacy_collect_use' role='checkbox' aria-label='개인정보 수집 및 이용 동의' aria-checked={individualAgreements.chk_join_terms_privacy_collect_use}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>[필수] 개인정보 수집 및 이용 동의</span>
                            </label>
                            <div>
                                <button style={{ height:'15px', width:'15px', backgroundColor:'rgb(170, 77, 203)' }} onClick={financeOpenModal}>
                                    
                                </button>

                                
                            </div>
                        </div>
                    </li>

                    {/* 나머지 체크박스 리스트 아이템들 */}
                </ul>
            </div>
            {showModal && (
                <div className="my-overlay">
                    <div className="my-modal">
                        <h2 style={{ color: 'white', marginBottom: '20px' }}><strong>이용약관 동의</strong></h2>
                        <p>제1조 총칙</p>
                        <div className="my-info-content">
                            <div className="info-box" style={{ justifyContent: 'center' }}>
                                <p>이것은 모달의 내용입니다.</p>
                            </div>
                        </div>
                        <button className="close" onClick={closeModal}>확인</button>
                    </div>
                </div>
            )}
            {financeModal && (
                <div className="my-overlay">
                    <div className="my-modal">
                        <h2 style={{ color: 'white', marginBottom: '20px' }}><strong>개인정보 동의</strong></h2>
                        <p>제1조 총칙</p>
                        <div className="my-info-content">
                            <div className="info-box" style={{ justifyContent: 'center' }}>
                                <p>이것은 모달의 내용입니다.</p>
                            </div>
                        </div>
                        <button className="close" onClick={closeFinanceModal}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agree;
