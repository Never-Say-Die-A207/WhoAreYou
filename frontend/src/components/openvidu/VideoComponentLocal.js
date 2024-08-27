import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import "./VideoComponentLocal.css";
import { FaceMesh } from '@mediapipe/face_mesh';
import React, { useRef, useEffect, useState } from 'react';
import * as cam from '@mediapipe/camera_utils';
import RedFoxLocal from "./RedFoxLocal";
import SpiderManLocal from "./SpiderManLocal";
import SpiderManBlackLocal from "./SpiderManBlackLocal";
import JokerLocal from "./JokerLocal";
import SquidLocal from "./SquidLocal";
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';


function VideoComponentLocal({ track, participantIdentity, local = false, mask }) {
    const videoElement = useRef(null);
    const [landmarks, setLandmarks] = useState(null);
    const faceLandmarkerRef = useRef(null);
    const lastVideoTimeRef = useRef(-1);

    useEffect(() => {
        if (videoElement.current && track) {
            track.attach(videoElement.current);
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
              faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
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
              if (videoElement.current) {
                  startPrediction();
              }
          } catch (error) {
              console.error("Error setting up FaceLandmarker:", error);
          }
      };
  
      const startPrediction = () => {
          const predict = async () => {
              if (videoElement.current) {
                  const nowInMs = Date.now();
                  if (lastVideoTimeRef.current !== videoElement.current.currentTime) {
                      lastVideoTimeRef.current = videoElement.current.currentTime;
                      if (faceLandmarkerRef.current) {
                          try {
                              const faceLandmarkerResult = await faceLandmarkerRef.current.detectForVideo(videoElement.current, nowInMs);
                            //   console.log(faceLandmarkerResult.faceLandmarks[0]);
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
          if (videoElement.current && videoElement.current.srcObject) {
              const stream = videoElement.current.srcObject;
              const tracks = stream.getTracks();
              tracks.forEach(track => track.stop());
              videoElement.current.srcObject = null;
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
    //         if (videoElement.current) {
    //             await faceMesh.send({ image: videoElement.current });
    //             requestAnimationFrame(detectLandmarks);
    //         }
    //     };

    //     if (videoElement.current) {
    //         videoElement.current.addEventListener('loadeddata', () => {
    //             detectLandmarks();
    //         });
    //     }

    //     return () => {
    //         if (faceMesh) {
    //             faceMesh.close();
    //         }
    //     };
    // }, []);

    return (
        <div id={"camera-" + participantIdentity} className="video-container-local">
            {/* <div className="participant-data">
                <p>{participantIdentity + (local ? " (You)" : "")}</p>
            </div> */}
            <video ref={videoElement} id={track.sid} style={{ transform: 'scaleX(-1)', display: 'none' }}></video>
            {mask === 'RedFox' && <RedFoxLocal landmarks={landmarks} videoElement={videoElement} />}
            {mask === 'SpiderMan' && <SpiderManLocal landmarks={landmarks} videoElement={videoElement} />}
            {mask === 'SpiderManBlack' && <SpiderManBlackLocal landmarks={landmarks} videoElement={videoElement} />}
            {mask === 'Squid' && <SquidLocal landmarks={landmarks} videoElement={videoElement} />}
            {mask === 'Joker' && <JokerLocal landmarks={landmarks} videoElement={videoElement} />}
        </div>
    );
}

export default VideoComponentLocal;
