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

    const closeModal = () => {
        setShowModal(false);
    };
    const [personalModal, setPersonalModal] = useState(false);

    const personalOpenModal = () => {
        setPersonalModal(true);
    };
    const closePersonalModal = () => {
        setPersonalModal(false);
    };

    const [otherModal, setOtherModal] = useState(false);

    const otherOpenModal = () => {
        setOtherModal(true);
    };

    const closeOtherModal = () => {
        setOtherModal(false);
    };

    const [marketModal, setMarketModal] = useState(false);

    const marketOpenModal = () => {
        setMarketModal(true);
    };

    const closeMarketModal = () => {
        setMarketModal(false);
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
                        "전체 동의에는 필수 및 선택 정보에 대한 동의가 포함되어 있으며,<br/> 개별적으로 동의를 선택하실 수 있습니다. 선택 항목에 대한 동의를<br/> 거부하시는 경우에도 서비스 이용이 가능합니다."
                    </span>
                </div>
                <div className='error-tip'></div>
                <ul className='terms'>
                    <li className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_join_terms_fourteen'
                                onChange={() => handleIndividualCheckboxChange('chk_join_terms_fourteen')}
                                checked={individualAgreements.chk_join_terms_fourteen}
                                aria-hidden='true'
                            />
                            <label htmlFor='chk_join_terms_fourteen' role='checkbox' aria-label='만 19세 이상입니다.' aria-checked={individualAgreements.chk_join_terms_fourteen}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>[필수] 만 19세 이상입니다.</span>
                            </label>
                        </div>
                    </li>
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
                                <button style={{ height:'15px', width:'15px', backgroundColor:'rgb(170, 77, 203)', color: 'white', fontSize: '10px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={agreeModal}>
                                    &gt;
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
                            <button style={{ height:'15px', width:'15px', backgroundColor:'rgb(170, 77, 203)', color: 'white', fontSize: '10px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={personalOpenModal}>
                                &gt;
                            </button>
                                
                            </div>
                        </div>
                    </li>
                    <li className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_agree_to_collect_third_part_information'
                                onChange={() => handleIndividualCheckboxChange('chk_agree_to_collect_third_part_information')}
                                checked={individualAgreements.chk_agree_to_collect_third_part_information}
                                aria-hidden='true'
                            />
                            <label htmlFor='chk_agree_to_collect_third_part_information' role='checkbox' aria-label='개인정보 제3자 제공 동의' aria-checked={individualAgreements.chk_agree_to_collect_third_part_information}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>[필수] 개인정보 제3자 제공 동의</span>
                            </label>
                            <div>

                                <button style={{ height:'15px', width:'15px', backgroundColor:'rgb(170, 77, 203)', color: 'white', fontSize: '10px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={otherOpenModal}>
                                    &gt;
                                </button>
                            </div>
                        </div>
                    </li>
                    <li className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_POLICY_AGREE_COLLECT'
                                onChange={() => handleIndividualCheckboxChange('chk_POLICY_AGREE_COLLECT')}
                                checked={individualAgreements.chk_POLICY_AGREE_COLLECT}
                                aria-hidden='true'
                            />
                            <label htmlFor='chk_POLICY_AGREE_COLLECT' role='checkbox' aria-label='마케팅 목적의 개인정보 수집 및 이용 동의' aria-checked={individualAgreements.chk_POLICY_AGREE_COLLECT}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>[선택] 마케팅 목적의 개인정보 이용 동의</span>
                            </label>
                            <div>

                                <button style={{ height:'15px', width:'15px', backgroundColor:'rgb(170, 77, 203)', color: 'white', fontSize: '10px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={marketOpenModal}>
                                    &gt;
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
                                <p>이 약관은 Who ARE YOU가 운영하는<br/> 사이버물에서 제공하는 서비스와 <br/> 이를 이용하는 회원의 권리 의무 및 <br/> 책임사항을 규정함을 목적으로 합니다.</p>
                            </div>
                        </div>
                        <button className="close" onClick={closeModal}>확인</button>
                    </div>
                </div>
            )}
            {personalModal && (
                <div className="my-overlay">
                    <div className="my-modal">
                        <h2 style={{ color: 'white', marginBottom: '20px' }}><strong>개인정보 동의</strong></h2>
                        <p>제1조 총칙</p>
                        <div className="my-info-content">
                            <div className="info-box" style={{ justifyContent: 'center' }}>
                                <p>연령 및 성별 정보는 회원 가입 <br/> 이후 본인 확인을 진행한 이용자에 한해 <br/> 활용됩니다. 동의를 거부할 수 <br/> 있으나 동의 거부 시 서비스 <br/> 이용이 제한됩니다.</p>
                            </div>
                        </div>
                        <button className="close" onClick={closePersonalModal}>확인</button>
                    </div>
                </div>
            )}
            {otherModal && (
                <div className="my-overlay">
                    <div className="my-modal">
                        <h2 style={{ color: 'white', marginBottom: '20px' }}><strong>개인정보 제3자 동의</strong></h2>
                        <p>제1조 총칙</p>
                        <div className="my-info-content">
                            <div className="info-box" style={{ justifyContent: 'center' }}>
                                <p>WHO ARE YOU 서비스 제공하는 경우 <br/> 전자상거래법에 의해 5년간 보관 후 파기하는데 <br/> 정보 제공에 동의합니다.</p>
                            </div>
                        </div>
                        <button className="close" onClick={closeOtherModal}>확인</button>
                    </div>
                </div>
            )}
            {marketModal && (
                <div className="my-overlay">
                    <div className="my-modal">
                        <h2 style={{ color: 'white', marginBottom: '20px' }}><strong>마케팅 개인정보 동의</strong></h2>
                        <p>제1조 총칙</p>
                        <div className="my-info-content">
                            <div className="info-box" style={{ justifyContent: 'center' }}>
                                <p>인구통계학적 특성과 이용자의 관심 및 성향의<br/>추정을 통한 맞춤형 광고에 활용합니다.<br/>동의 철회시 맞춤형 광고 차단<br/>회원 탈퇴시 파기합니다. </p>
                            </div>
                        </div>
                        <button className="close" onClick={closeMarketModal}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agree;
