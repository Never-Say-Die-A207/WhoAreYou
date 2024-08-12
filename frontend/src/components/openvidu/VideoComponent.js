import React, { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import RedFoxRemote from "./RedFoxRemote";
import FaceRecognition from './FaceRecognition';
import './VideoComponent.css';
import SpiderManRemote from './SpiderManRemote';
import SpiderManBlackRemote from './SpiderManBlackRemote';
import SquidRemote from './SquidRemote';
import JokerRemote from './JokerRemote';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

function VideoComponent({ track, participantIdentity, setExpressionData, local = false, maskRemote, setEmotionCounts }) {
  const videoElement2 = useRef(null);
  const [landmarks, setLandmarks] = useState(null);
  const faceLandmarkerRef2 = useRef(null);
  const lastVideoTimeRef = useRef(-1);



  useEffect(() => {
    if (videoElement2.current && track) {
      track.attach(videoElement2.current);
    }

    return () => {
      if (track) {
        track.detach();
      }
    };
  }, [track]);

  useEffect(() => {
    const setup = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
        faceLandmarkerRef2.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          numFaces: 1,
          runningMode: "VIDEO",
          // outputFaceBlendshapes: true,
          // outputFacialTransformationMatrixes: true,
        });

        // 비디오 요소가 이미 렌더링된 경우 예측 시작
        if (videoElement2.current) {
          startPrediction();
        }
      } catch (error) {
        console.error("Error setting up FaceLandmarker:", error);
      }
    };

    const startPrediction = () => {
      const predict = async () => {
        if (videoElement2.current) {
          const nowInMs = Date.now();
          if (lastVideoTimeRef.current !== videoElement2.current.currentTime) {
            lastVideoTimeRef.current = videoElement2.current.currentTime;
            if (faceLandmarkerRef2.current) {
              try {
                const faceLandmarkerResult = await faceLandmarkerRef2.current.detectForVideo(videoElement2.current, nowInMs);
                // console.log(faceLandmarkerResult.faceLandmarks[0]);
                setLandmarks(faceLandmarkerResult.faceLandmarks[0]);
              } catch (error) {
                console.error("Error detecting face landmarks:", error);
              }
            }
          }
          // 예측을 계속하기 위해 requestAnimationFrame을 사용합니다.
          window.requestAnimationFrame(predict);
        }
      };

      predict(); // 예측 함수 시작
    };

    setup();

    // 컴포넌트가 언마운트될 때 자원을 해제합니다.
    return () => {
      if (videoElement2.current && videoElement2.current.srcObject) {
        const stream = videoElement2.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement2.current.srcObject = null;
      }
    };
  }, []); // 빈 배열을 사용하여 컴포넌트가 마운트될 때만 실행합니다.


  // useEffect(() => {
  //     const faceMesh = new FaceMesh({
  //         locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  //     });

  //     faceMesh.setOptions({
  //         maxNumFaces: 1,
  //         minDetectionConfidence: 0.5,
  //         minTrackingConfidence: 0.5,
  //     });

  //     faceMesh.onResults((results) => {
  //         if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
  //             const landmarks = results.multiFaceLandmarks[0];
  //             setLandmarks(landmarks);
  //         }
  //     });

  //     const detectLandmarks = async () => {
  //         if (videoElement2.current) {
  //             await faceMesh.send({ image: videoElement2.current });
  //             requestAnimationFrame(detectLandmarks);
  //         }
  //     };
  //     if (videoElement2.current) {
  //     videoElement2.current.addEventListener('loadeddata', () => {
  //         detectLandmarks();
  //     });
  //   }
  //     return () => {
  //         if (faceMesh) {
  //             faceMesh.close();
  //         }
  //     };
  // }, []);

  return (
    <div id={"camera-" + participantIdentity} className="video-container">
      <div className="participant-data">
        <p>{participantIdentity + (local ? " (You)" : "")}</p>
      </div>
      <video ref={videoElement2} id={track.sid} style={{ display: 'none' }} />
      {/* <RedFoxRemote landmarks={landmarks} videoElement={videoElement2} /> */}
      {maskRemote === 'RedFox' && <RedFoxRemote landmarks={landmarks} videoElement={videoElement2} />}
      {maskRemote === 'SpiderMan' && <SpiderManRemote landmarks={landmarks} videoElement={videoElement2} />}
      {maskRemote === 'SpiderManBlack' && <SpiderManBlackRemote landmarks={landmarks} videoElement={videoElement2} />}
      {maskRemote === 'Squid' && <SquidRemote landmarks={landmarks} videoElement={videoElement2} />}
      {maskRemote === 'Joker' && <JokerRemote landmarks={landmarks} videoElement={videoElement2} />}
      {videoElement2.current && (
          <FaceRecognition 
              videoElement={videoElement2} 
              setExpressionData={setExpressionData} 
              setEmotionCounts={setEmotionCounts} 
          />
      )}
    </div>
  );
}

export default VideoComponent;