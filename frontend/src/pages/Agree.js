import React, { useState } from 'react';
import './Agree.css';

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
            onAgreeChange(newState);  // 부모 컴포넌트에 새로운 동의 상태를 전달합니다.
            return newState;
        });
    };

    const handleIndividualCheckboxChange = (id) => {
        setIndividualAgreements(state => {
            const newState = { ...state, [id]: !state[id] };
            const allAgreed = Object.values(newState).every(value => value);
            setAgreed(allAgreed);
            onAgreeChange(newState);  // 부모 컴포넌트에 새로운 동의 상태를 전달합니다.
            return newState;
        });
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
                            <button className='icon icon-right-arrow' type='button' aria-haspopup='dialog' aria-label='약관 대화상자 열기'></button>
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
                            <button className='icon icon-right-arrow' type='button' aria-haspopup='dialog' aria-label='약관 대화상자 열기'></button>
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
                                <span aria-hidden='true'>[선택] 마케팅 목적의 개인정보 수집 및 이용 동의</span>
                            </label>
                            <button className='icon icon-right-arrow' type='button' aria-haspopup='dialog' aria-label='약관 대화상자 열기'></button>
                        </div>
                    </li>
                    <li className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_agree_to_receive_ads'
                                onChange={() => handleIndividualCheckboxChange('chk_agree_to_receive_ads')}
                                checked={individualAgreements.chk_agree_to_receive_ads}
                                aria-hidden='true'
                            />
                            <label htmlFor='chk_agree_to_receive_ads' role='checkbox' aria-label='광고성 정보 수신 동의' aria-checked={individualAgreements.chk_agree_to_receive_ads}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>[선택] 광고성 정보 수신 동의</span>
                            </label>
                            <button className='icon icon-right-arrow' type='button' aria-haspopup='dialog' aria-label='약관 대화상자 열기'></button>
                        </div>
                    </li>
                    <li className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_POLICY_AGREE_EMAIL'
                                onChange={() => handleIndividualCheckboxChange('chk_POLICY_AGREE_EMAIL')}
                                checked={individualAgreements.chk_POLICY_AGREE_EMAIL}
                                aria-hidden='true'
                            />
                            <label htmlFor='chk_POLICY_AGREE_EMAIL' role='checkbox' aria-label='이메일 수신 동의' aria-checked={individualAgreements.chk_POLICY_AGREE_EMAIL}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>[선택] 이메일 수신 동의</span>
                            </label>
                        </div>
                    </li>
                    <li className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_POLICY_AGREE_SMS'
                                onChange={() => handleIndividualCheckboxChange('chk_POLICY_AGREE_SMS')}
                                checked={individualAgreements.chk_POLICY_AGREE_SMS}
                                aria-hidden='true'
                            />
                            <label htmlFor='chk_POLICY_AGREE_SMS' role='checkbox' aria-label='SMS, SNS 수신 동의' aria-checked={individualAgreements.chk_POLICY_AGREE_SMS}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>[선택] SMS, SNS 수신 동의</span>
                            </label>
                        </div>
                    </li>
                    <li className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input 
                                type='checkbox' 
                                id='chk_POLICY_AGREE_PUSH'
                                onChange={() => handleIndividualCheckboxChange('chk_POLICY_AGREE_PUSH')}
                                checked={individualAgreements.chk_POLICY_AGREE_PUSH}
                                aria-hidden='true'
                            />
                            <label htmlFor='chk_POLICY_AGREE_PUSH' role='checkbox' aria-label='앱 푸시 수신 동의' aria-checked={individualAgreements.chk_POLICY_AGREE_PUSH}>
                                <div aria-hidden='true' className='icon icon-chk'></div>
                                <span aria-hidden='true'>[선택] 앱 푸시 수신 동의</span>
                            </label>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Agree;
