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
            console.log("Models loaded");
        };

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
                    } 
                    else if (expressions.neutral > 0.6) {
                        expressionData = { borderClass: 'neutral', imageSrc: neutralImage };
                        detectedEmotion = 'neutral';
                    }

                    // 감정 카운트 업데이트
                    if (detectedEmotion) {
                        setEmotionCounts((prev) => {
                            const newCount = prev[detectedEmotion] + 1; // 감정 카운트 증가
                            console.log(`${detectedEmotion} 감정 카운트: ${newCount}`); // 카운트 출력
                            
                            setExpressionData((prevExpressionData) => ({
                                ...prevExpressionData,
                                count: newCount, 
                                ...expressionData, 
                            }));

                            return {
                                ...prev,
                                [detectedEmotion]: newCount, 
                            };
                        });
                    }
                }
            }
        };

        loadModels().then(() => {
            const interval = setInterval(() => {
                detectFace();
            }, 2000);
            return () => clearInterval(interval);
        });
    }, [videoElement, setExpressionData, setEmotionCounts]);

    return null; // UI 없이 null 반환
};

export default FaceRecognition;