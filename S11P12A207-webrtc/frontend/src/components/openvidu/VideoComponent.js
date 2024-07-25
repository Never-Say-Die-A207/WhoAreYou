import React, { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import RedFoxRemote from "./RedFoxRemote";
import FaceRecognition from './FaceRecognition';
import './VideoComponent.css';
import SpiderManRemote from './SpiderManRemote';

function VideoComponent({ track, participantIdentity, setExpressionData, local = false, maskRemote }) {
  const videoElement2 = useRef(null);
  const [landmarks, setLandmarks] = useState(null);
  const cameraRef = useRef(null); // Camera reference to stop it later

  useEffect(() => {
    if (videoElement2.current && track) {
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
          if (videoElement2.current) {
            await faceMesh.send({ image: videoElement2.current });
          }
        },
        width: 1280,
        height: 720,
      });
      camera.start();
      cameraRef.current = camera;
    }

    return () => {
      if (track) {
        track.detach();
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [track]);

  return (
    <div id={"camera-" + participantIdentity} className="video-container">
      <div className="participant-data">
        <p>{participantIdentity + (local ? " (You)" : "")}</p>
      </div>
      <video ref={videoElement2} id={track.sid} style={{ display: 'none' }} />
      <RedFoxRemote landmarks={landmarks} videoElement={videoElement2} />
      {/* {maskRemote === 'RedFox' && <RedFoxRemote landmarks={landmarks} videoElement={videoElement2} />}
      {maskRemote === 'SpiderMan' && <SpiderManRemote landmarks={landmarks} videoElement={videoElement2} />} */}
      <FaceRecognition videoElement={videoElement2} setExpressionData={setExpressionData} />
    </div>
  );
}

export default VideoComponent;
