import React, { useState } from 'react';
import './Agree.css';

const Agree = ({ onAgreeChange }) => {
    const [agreed, setAgreed] = useState(false);

    const handleCheckboxChange = () => {
        setAgreed(!agreed);
        onAgreeChange(!agreed);
    };

    return (
        <div id='c-jointerms' className='jointerms'>
            <div className='g-terms-checkbox'>
                <div className='checkall checkall-first'>
                    <div id='c-checkbox-item_checkall' className='c-checkbox_item'>
                        <div className='wrapper'>
                            <input type='checkbox' id='chk_checkall' aria-hidden='true' parent-id></input>
                            <label for='chk_checkall' role='checkbox' aria-label='모두 확인하였으며 동의합니다.' aria-checked='false'>
                                <i aria-hidden='true' className='icon icon-chk'></i>
                                <span aria-hidden='true'>모두 확인하였으며 동의합니다.</span>
                            </label>
                        </div>
                    </div>
                    <span className='message'>
                        "전체 동의에는 필수 및 선택 정보에 대한 동의가 포함되어 있으며, &nbsp; 개별적으로 동의를 선택하실 수 있습니다. &nbsp; 선택 항목에 대한 동의를 거부하시는 경우에도 서비스 이용이 가능합니다."
                    </span>
                </div>
                <div className='error-tip'></div>
                <ul className='terms'>
                    <div id='c-checkbox-item_join-terms-fourteen' className='c-checkbox-item'>
                        <div className='wrapper'>
                            <input type='checkbox' id='chk_join-terms-fourteen' aria-hidden='true' parent-id></input>
                            <label for='chk_join-terms-fourteen' role='checkbox' aria-label='만 14세 이상입니다.' aria-checked='false'>
                                <i aria-hidden='true' className='icon icon-chk'></i>
                                <span aria-hidden='true'>[필수] 만 14세 이상입니다.</span>
                            </label>
                        </div>

                    </div>
                    <div id='c-checkbox-item_join-terms-service' className='c-checkbox-item'></div>
                    <div id='c-checkbox-item_join-terms-commerce' className='c-checkbox-item'></div>
                    <div id='c-checkbox-item_join-terms-privacy-collect-use' className='c-checkbox-item'></div>
                    <div id='c-checkbox-item_agree-to-collect-third-part-information' className='c-checkbox-item'></div>
                    <div id='c-checkbox-item_POLICY_AGREE_COLLECT' className='c-checkbox-item'></div>
                    <div id='c-checkbox-item_agree-to-receive-ads' className='c-checkbox-item'></div>
                    <div id='c-checkbox-item_POLICY_AGREE_EMAIL' className='c-checkbox-item c-checkbox-item__subitem'></div>
                    <div id='c-checkbox-item_POLICY_AGREE_SMS' className='c-checkbox-item c-checkbox-item__subitem'></div>
                    <div id='c-checkbox-item_POLICY_AGREE_MARKETING_PUSH' className='c-checkbox-item c-checkbox-item__subitem'></div>

                </ul>
            </div>

            <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={handleCheckboxChange}
            />
            <label htmlFor="agree">
                개인정보 수집 및 이용에 동의합니다.
            </label>
        </div>
    );
};

export default Agree;
