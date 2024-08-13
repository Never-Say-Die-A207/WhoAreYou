import React, { useState } from 'react';
import './RoomBottom.css';
import FaceRecognition from './FaceRecognition';
import EmotionBarChart from './EmotionBarChart';

function RoomBottom({ expressionData, leaveRoom }) {
  const { borderClass, imageSrc, count } = expressionData;
  const [emotionCounts, setEmotionCounts] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    disgusted: 0,
    surprised: 0,
    fear: 0,
    neutral: 0,
});


  return (
    <div className='room-bottom'>
      
      
      <div>
        <button className="bottom-button" onClick={leaveRoom}>
          나가기
        </button>
      </div>
    </div>
  );
}

export default RoomBottom;