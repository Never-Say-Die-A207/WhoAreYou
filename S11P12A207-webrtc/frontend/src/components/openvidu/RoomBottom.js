import React from 'react';
import './RoomBottom.css';

function RoomBottom({ expressionData }) {
  const { borderClass, imageSrc } = expressionData;

  // 로깅을 통해 RoomBottom이 받아온 데이터 확인
  // console.log('Received expressionData in RoomBottom:', expressionData);

  return (
    <div className={`room-bottom-container ${borderClass}`}>
      <button className="bottom-button">
        홈으로 가기
      </button>
      {imageSrc && <img src={imageSrc} alt="expression" className="bottom-image" />}
      <button className="bottom-button">
        다시 매칭하기
      </button>
    </div>
  );
}

export default RoomBottom;
