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

function VideoComponent({ track, participantIdentity, setExpressionData, local = false, maskRemote, setEmotionCounts }) {
  const videoElement2 = useRef(null);
  const [landmarks, setLandmarks] = useState(null);
  const [faceMeshErrRemote, setfaceMeshErrRemote] = useState(true)

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

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    if (faceMesh) {

      faceMesh.setOptions({
        maxNumFaces: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          setLandmarks(landmarks);
        }
      });

      const detectLandmarks = async () => {
        if (videoElement2.current) {
          await faceMesh.send({ image: videoElement2.current });
          requestAnimationFrame(detectLandmarks);
        }
      };
      if (videoElement2.current) {
        videoElement2.current.addEventListener('loadeddata', () => {
          detectLandmarks();
        });
      }
    } else {
      setfaceMeshErrRemote(!faceMeshErrRemote)
    }
    return () => {
      if (faceMesh) {
        faceMesh.close();
      }
    };
  }, [faceMeshErrRemote]);

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
      <FaceRecognition videoElement={videoElement2} setExpressionData={setExpressionData} setEmotionCounts={setEmotionCounts} />
    </div>
  );
}

export default VideoComponent;