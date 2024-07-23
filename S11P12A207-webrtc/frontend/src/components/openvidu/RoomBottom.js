import React from 'react';
import './RoomBottom.css';

function RoomBottom({ }) {
  return (
    <div className="room-bottom-container">
      <button className="bottom-button">
        홈으로 가기
      </button>
      <img src="https://placehold.co/600x400" alt="Image" className="bottom-image" />
      <button className="bottom-button">
        다시 매칭하기
      </button>
    </div>
  );
}

export default RoomBottom;
