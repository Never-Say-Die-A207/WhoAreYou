import React from 'react';
import happyImage from '../../assets/happy.png';
import sadImage from '../../assets/sad.png';
import angryImage from '../../assets/angry.png';
import disgustedImage from '../../assets/disgusted.png';
import surprisedImage from '../../assets/surprised.png';
import fearImage from '../../assets/fear.png';
import neutralImage from '../../assets/neutral.png';
import './PictureSeven.css';

function PictureSeven({ expressionData, emotionCounts }) {
    const emotionImages = {
        happy: happyImage,
        sad: sadImage,
        angry: angryImage,
        surprised: surprisedImage,
        fear: fearImage,
        disgusted: disgustedImage,
        neutral: neutralImage,
    };

    const emotionLabels = {
        happy: '행복',
        sad: '슬픔',
        angry: '화남',
        surprised: '놀람',
        fear: '공포',
        disgusted: '혐오',
        neutral: '중립',
    };

    const emotions = ['happy', 'sad', 'angry', 'surprised', 'fear', 'disgusted', 'neutral'];

    // 감정 발생 횟수로 정렬한 상위 3개의 감정 추출
    const top3Emotions = Object.entries(emotionCounts)
        .sort(([, countA], [, countB]) => countB - countA) // count로 정렬
        .slice(0, 3) // 상위 3개 추출
        .map(([emotion]) => emotion); // 감정 키만 배열로 반환

    return (
        <div className="emotion-wrapper">
            <div className="top3-container">
                <h3>TOP3 감정</h3>
                <div className="top3-emotions">
                    {top3Emotions.map((emotion, index) => (
                        <div
                            key={index}
                            className="top3-item"
                        >
                            <img
                                src={emotionImages[emotion]}
                                alt={emotion}
                                className="top3-image"
                            />
                            {/* <span className="top3-label">{emotionLabels[emotion]}</span> */}
                        </div>
                    ))}
                </div>
            </div>

            <div className="emotion-container">
                {/* <h3>현재 감정</h3> */}
                {emotions.map((emotion, index) => (
                    <div
                        key={index}
                        className={`emotion-item ${expressionData.borderClass === emotion ? 'active' : ''}`}
                    >
                        <img
                            src={emotionImages[emotion]}
                            alt={emotion}
                            className="emotion-image"
                        />
                        <span className="emotion-label">{emotionLabels[emotion]}</span>
                    </div>
                ))}
            </div>


        </div>
    );
}

export default PictureSeven;
