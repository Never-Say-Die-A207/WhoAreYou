import React, { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import RedFox from "./RedFox";
import FaceRecognition from './FaceRecognition';
import './VideoComponent.css';

function VideoComponent({ track, participantIdentity, setExpressionData, local = false }) {
  const videoElement2 = useRef(null);
  const [landmarks, setLandmarks] = useState(null);

  useEffect(() => {
    if (videoElement2.current) {
      track.attach(videoElement2.current);

      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          setLandmarks(landmarks); // landmarks 상태 업데이트
        }
      });

      const camera = new cam.Camera(videoElement2.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoElement2.current });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <div id={"camera-" + participantIdentity} className="video-container">
      <div className="participant-data">
        <p>{participantIdentity + (local ? " (You)" : "")}</p>
      </div>
      <video ref={videoElement2} id={track.sid} style={{ display: 'none' }} />
      <RedFox landmarks={landmarks} videoElement={videoElement2} />
      <FaceRecognition videoElement={videoElement2} setExpressionData={setExpressionData} />
    </div>
  );
}

export default VideoComponent;
