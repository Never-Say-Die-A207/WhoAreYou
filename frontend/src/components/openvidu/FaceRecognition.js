import React, { useEffect } from 'react';
import * as faceapi from 'face-api.js';
import joyImage from '../../assets/joy.png';
import sadnessImage from '../../assets/sadness.png';
import angerImage from '../../assets/anger.png';
import disgustImage from '../../assets/disgust.png';
import embrassmentImage from '../../assets/embrassment.png';
import fearImage from '../../assets/fear.png';
import ennuiImage from '../../assets/ennui.png';

const FaceRecognition = ({ videoElement, setExpressionData }) => {
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
            const expressions = detections[0].expressions;
            let expressionData = { borderClass: '', imageSrc: null };

            if (expressions.happy > 0.6) {
              expressionData = { borderClass: 'joy', imageSrc: joyImage };
            } else if (expressions.sad > 0.6) {
              expressionData = { borderClass: 'sadness', imageSrc: sadnessImage };
            } else if (expressions.angry > 0.6) {
              expressionData = { borderClass: 'anger', imageSrc: angerImage };
            } else if (expressions.disgusted > 0.6) {
              expressionData = { borderClass: 'disgust', imageSrc: disgustImage };
            } else if (expressions.surprised > 0.6) {
              expressionData = { borderClass: 'embrassment', imageSrc: embrassmentImage };
            } else if (expressions.fear > 0.6) {
              expressionData = { borderClass: 'fear', imageSrc: fearImage };
            } else if (expressions.neutral > 0.6) {
              expressionData = { borderClass: 'ennui', imageSrc: ennuiImage };
            }

            setExpressionData(expressionData); // 감정 데이터를 부모 컴포넌트로 전달
          }
        }
      };

      const interval = setInterval(() => {
        detectFace();
      }, 500);

      return () => clearInterval(interval);
    });
  }, [videoElement, setExpressionData]);

  return null;
};

export default FaceRecognition;
