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

    const emotionMessages = {
        happy: '이런이런 사랑에 빠졌어. 이제 내가 시도때도 없이 웃어도 이해해줘.',
        sad: '상대방이 당신을 만나서 슬픔에 빠졌습니다',
        angry: '상대방이 화난 상태입니다. 스스로를 돌아보세요.',
        surprised: '현재까지 상대방의 주된 감정은 놀람입니다.',
        fear: '상대방은 당신을 무서워 합니다.',
        disgusted: '상대방은 당신을 굉장히 불쾌해 합니다.',
        neutral: '현재까지 상대방이 당신에게 중립 상태입니다',
    };

    const emotions = ['happy', 'sad', 'angry', 'surprised', 'fear', 'disgusted', 'neutral'];

    // 감정 발생 횟수로 정렬한 상위 1개의 감정 추출
    const topEmotion = Object.entries(emotionCounts)
        .sort(([, countA], [, countB]) => countB - countA) // count로 정렬
        .map(([emotion]) => emotion)[0]; // 가장 높은 감정 추출

    return (
        <div className="emotion-wrapper">
             <div className="top1-message">
                <h3>{emotionMessages[topEmotion]}</h3>
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
