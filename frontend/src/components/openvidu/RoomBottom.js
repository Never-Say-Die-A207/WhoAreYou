import React from 'react';
import './RoomBottom.css';

function RoomBottom({ expressionData, leaveRoom }) {
  const { borderClass, imageSrc, count } = expressionData;

  return (
    <div className='room-bottom'>
      <div className={`room-bottom-container ${borderClass}`}>
        {imageSrc && (
          <div style={{ position: 'relative' }}>
            <img src={imageSrc} alt="expression" className="bottom-image" />
            {/* 카운트를 표현하는 요소 추가 */}
            {count > 0 && (
              <div 
                className="emotion-count" 
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  zIndex: '1',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '5px',
                  padding: '5px',
                }}
              >
                {count}
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <button className="bottom-button" onClick={leaveRoom}>
          홈으로 가기
        </button>
        <button className="bottom-button">
          다시 매칭하기
        </button>
      </div>
    </div>
  );
}

export default RoomBottom;
