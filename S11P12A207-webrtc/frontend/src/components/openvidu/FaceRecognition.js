import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

import joyImage from '../../assets/joy.png';
import sadnessImage from '../../assets/sadness.png';
import angerImage from '../../assets/anger.png';
import disgustImage from '../../assets/disgust.png';
import embrassmentImage from '../../assets/embrassment.png';
import fearImage from '../../assets/fear.png';
import ennuiImage from '../../assets/ennui.png';

const FaceRecognition = ({ setExpressionData }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
      await faceapi.loadFaceLandmarkModel(MODEL_URL);
      await faceapi.loadFaceExpressionModel(MODEL_URL);
      setIsModelLoaded(true);
      console.log('Models loaded successfully');  // 확인 로그
    };
    loadModels();
  }, []);

  useEffect(() => {
    const startWebcam = async () => {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          console.log('Webcam stream started');  // 확인 로그
        };
      }
    };

    if (isModelLoaded) {
      startWebcam();
    }
  }, [isModelLoaded]);

  useEffect(() => {
    const detectFace = async () => {
      if (videoRef.current && videoRef.current.readyState === 4 && isModelLoaded) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 512,
            scoreThreshold: 0.5
          })
        ).withFaceLandmarks().withFaceExpressions();

        console.log('Detections:', detections); // 확인 로그

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

          setExpressionData(expressionData);
          console.log('Expression Data:', expressionData); // 확인 로그
        }

        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        };

        if (canvasRef.current) {
          const context = canvasRef.current.getContext('2d', { willReadFrequently: true });
          faceapi.matchDimensions(canvasRef.current, displaySize);

          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
        }
      }
    };

    const interval = setInterval(() => {
      detectFace();
    }, 500);

    return () => clearInterval(interval);
  }, [isModelLoaded, setExpressionData]);

  return (
    <div className='myapp'>
      <h1>Face Recognition using WebRTC</h1>
      <div className='appvide'>
        <div className='video-wrapper'>
          <video 
            ref={videoRef}
            className={'video-feed'}
            autoPlay
            muted
          />
          <canvas 
            ref={canvasRef} 
            width="720" 
            height="560" 
            className="appcanvas">
          </canvas>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
