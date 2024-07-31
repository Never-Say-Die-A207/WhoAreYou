import React, { useState } from 'react';
import './Agree.css';

const Agree = ({ onAgreeChange }) => {
    const [agreed, setAgreed] = useState(false);

    const handleCheckboxChange = () => {
        setAgreed(!agreed);
        onAgreeChange(!agreed);
    };

    return (
        <div className="cont_division">
            <span className='terms-agree'>
                <strong>약관</strong>
            </span>
            <div className='agree_box'>
                <ul className='agree_article'>
                    <li>
                        <div className='InBox'>
                            <span className='Chk SizeL'>
                                <input type='checkbox' className='check_mail' id='agreeAllPersonal'></input>
                                <label className='check_all check_off Lbi' for="agreeAllPersonal"></label>
                                <input type='hidden' name='hidden_check_all' value='0' id='hidden_check_all'></input>
                            </span>
                        </div>
                        <p className='agree_txt'>위치기반 서비스 이용약관(선택), 마케팅 정보 수신 동의(이메일, SMS/MMS)(선택) 동의를 포함합니다.</p>
                    </li>
                </ul>
                <ul className='agree_article depth2'></ul>
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
