import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import "./VideoComponentLocal.css";
import { FaceMesh } from '@mediapipe/face_mesh';
import React, { useRef, useEffect, useState } from 'react';
import * as Facemesh from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import RedFox from "./RedFox";
import SpiderMan from "./SpiderMan";

function VideoComponentLocal({ track, participantIdentity, local, }) {
    const videoElement = useRef(null);
    const canvasRef = useRef(null);
    const connect = window.drawConnectors;
    const [landmarks, setLandmarks] = useState(null);

    useEffect(() => {
        if (videoElement.current) {
            track.attach(videoElement.current);

            const faceMesh = new FaceMesh({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
            });

            faceMesh.setOptions({
                maxNumFaces: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            faceMesh.onResults((results) => {
                const canvasElement = canvasRef.current;
                const canvasCtx = canvasElement.getContext('2d');
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                // 비디오 프레임을 캔버스에 그리기
                canvasCtx.drawImage(videoElement.current, 0, 0, canvasElement.width, canvasElement.height);

                if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                    const landmarks = results.multiFaceLandmarks[0];
                    setLandmarks(landmarks); // landmarks 상태 업데이트
                }
            });

            const camera = new cam.Camera(videoElement.current, {
                onFrame: async () => {
                    await faceMesh.send({ image: videoElement.current });
                },
                width: 1280, // 해상도 높이기
                height: 720, // 해상도 높이기
            });
            camera.start();
        }

        return () => {
            track.detach();
        };
    }, [track]);

    useEffect(() => {
        const renderFrame = () => {
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext('2d');

            if (videoElement.current) {
                canvasCtx.drawImage(videoElement.current, 0, 0, canvasElement.width, canvasElement.height);
            }

            requestAnimationFrame(renderFrame);
        };

        renderFrame();
    }, []);

    return (
        <div id={"camera-" + participantIdentity} className="video-container-local">
            <div className="participant-data">
                <p>{participantIdentity + (local ? " (You)" : "")}</p>
            </div>
            <video ref={videoElement} id={track.sid} style={{ display: 'none' }}></video>
            {/* dispaly있음 */}
 
            <canvas ref={canvasRef} className="output_canvas" width="1280" height="720" style={{ transform: 'scaleX(-1)', position: 'absolute', left:'0'}}></canvas>
            {/* <RedFox landmarks={landmarks} videoElement={videoElement} /> */}
            <SpiderMan landmarks={landmarks} videoElement={videoElement}/>
            {/* {mask === 'redfox' && <RedFox landmarks={landmarks} videoElement={videoElement} />}
            {mask === 'spiderman' && <SpiderMan landmarks={landmarks} videoElement={videoElement} />} */}
        </div>
    );
}

export default VideoComponentLocal;
