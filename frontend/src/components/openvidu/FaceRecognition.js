import React, { useEffect } from 'react';
import * as faceapi from 'face-api.js';
import happyImage from '../../assets/happy.png';
import sadImage from '../../assets/sad.png';
import angryImage from '../../assets/angry.png';
import disgustedImage from '../../assets/disgusted.png';
import surprisedImage from '../../assets/surprised.png';
import fearImage from '../../assets/fear.png';
import neutralImage from '../../assets/neutral.png';

const FaceRecognition = ({ videoElement, setExpressionData, setEmotionCounts }) => {
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
            await faceapi.loadFaceLandmarkModel(MODEL_URL);
            await faceapi.loadFaceExpressionModel(MODEL_URL);
        };

        loadModels().then(() => {
            const detectFace = async () => {
                if (videoElement.current && videoElement.current.readyState === 4) {
                    const detections = await faceapi.detectAllFaces(
                        videoElement.current, 
                        new faceapi.TinyFaceDetectorOptions({
                            inputSize: 512,
                            scoreThreshold: 0.5
                        })
                    ).withFaceLandmarks().withFaceExpressions();

                    if (detections.length > 0) {
                        const expressions = detections[0].expressions; // 첫 번째 얼굴의 감정 데이터
                        let expressionData = { borderClass: '', imageSrc: null };
                        let detectedEmotion = '';

                        // 감정 탐지 및 처리
                        if (expressions.happy > 0.6) {
                            expressionData = { borderClass: 'happy', imageSrc: happyImage };
                            detectedEmotion = 'happy';
                        } else if (expressions.sad > 0.6) {
                            expressionData = { borderClass: 'sad', imageSrc: sadImage };
                            detectedEmotion = 'sad';
                        } else if (expressions.angry > 0.6) {
                            expressionData = { borderClass: 'angry', imageSrc: angryImage };
                            detectedEmotion = 'angry';
                        } else if (expressions.disgusted > 0.6) {
                            expressionData = { borderClass: 'disgusted', imageSrc: disgustedImage };
                            detectedEmotion = 'disgusted';
                        } else if (expressions.surprised > 0.6) {
                            expressionData = { borderClass: 'surprised', imageSrc: surprisedImage };
                            detectedEmotion = 'surprised';
                        } else if (expressions.fear > 0.6) {
                            expressionData = { borderClass: 'fear', imageSrc: fearImage };
                            detectedEmotion = 'fear';
                        } else if (expressions.neutral > 0.6) {
                            expressionData = { borderClass: 'neutral', imageSrc: neutralImage };
                            detectedEmotion = 'neutral';
                        }

                        // 감정 카운트 업데이트
                        if (detectedEmotion) {
                            setEmotionCounts((prev) => {
                                const newCount = prev[detectedEmotion] + 1; // 감정 카운트 증가
                                console.log(`${detectedEmotion} 감정 카운트: ${newCount}`); // 카운트 출력
                                
                                // expressionData에 카운트를 포함하여 return
                                setExpressionData((prevExpressionData) => ({
                                    ...prevExpressionData, // 이전 상태 유지
                                    count: newCount, // 최신 카운트 전달
                                    ...expressionData, // 감정 데이터 전달
                                }));

                                return {
                                    ...prev,
                                    [detectedEmotion]: newCount, // 업데이트된 카운트 반환
                                };
                            });
                        }
                    }
                }
            };

            const interval = setInterval(() => {
                detectFace();
            }, 500);

            return () => clearInterval(interval);
        });
    }, [videoElement, setExpressionData, setEmotionCounts]); // setEmotionCounts를 의존성 배열에 추가

    return null; // UI 없이 null 반환
};

export default FaceRecognition;