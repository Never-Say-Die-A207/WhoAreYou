import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import joyImage from '../../assets/joy.png';
import sadnessImage from '../../assets/sadness.png';
import angerImage from '../../assets/anger.png';
import disgustImage from '../../assets/disgust.png';
import embrassmentImage from '../../assets/embrassment.png';
import fearImage from '../../assets/fear.png';
import ennuiImage from '../../assets/ennui.png';

const FaceRecognition = ({ videoElement, setExpressionData }) => {
  const [emotionCounts, setEmotionCounts] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    disgusted: 0,
    surprised: 0,
    fear: 0,
    neutral: 0,
  });

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
              expressionData = { borderClass: 'joy', imageSrc: joyImage };
              detectedEmotion = 'happy';
            } else if (expressions.sad > 0.6) {
              expressionData = { borderClass: 'sadness', imageSrc: sadnessImage };
              detectedEmotion = 'sad';
            } else if (expressions.angry > 0.6) {
              expressionData = { borderClass: 'anger', imageSrc: angerImage };
              detectedEmotion = 'angry';
            } else if (expressions.disgusted > 0.6) {
              expressionData = { borderClass: 'disgust', imageSrc: disgustImage };
              detectedEmotion = 'disgusted';
            } else if (expressions.surprised > 0.6) {
              expressionData = { borderClass: 'embrassment', imageSrc: embrassmentImage };
              detectedEmotion = 'surprised';
            } else if (expressions.fear > 0.6) {
              expressionData = { borderClass: 'fear', imageSrc: fearImage };
              detectedEmotion = 'fear';
            } else if (expressions.neutral > 0.6) {
              expressionData = { borderClass: 'ennui', imageSrc: ennuiImage };
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
  }, [videoElement, setExpressionData]);

  return null; // UI 없이 null 반환
};

export default FaceRecognition;
