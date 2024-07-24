import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import "./VideoComponent.css";
import { FaceMesh } from '@mediapipe/face_mesh';
import React, { useRef, useEffect, useState } from 'react';
import * as Facemesh from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import RedFox from "./RedFox";
import SpiderMan from "./SpiderMan";

function VideoComponent({ track, participantIdentity, local = false, }) {
    const videoElement2 = useRef(null);
    const canvasRef = useRef(null);
    const connect = window.drawConnectors;
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
                if (canvasRef.current) {
                    const canvasElement = canvasRef.current;
                    const canvasCtx = canvasElement.getContext('2d');
                    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                    // 비디오 프레임을 캔버스에 그리기
                    canvasCtx.drawImage(videoElement2.current, 0, 0, canvasElement.width, canvasElement.height);
                }
                if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                    const landmarks = results.multiFaceLandmarks[0];
                    setLandmarks(landmarks); // landmarks 상태 업데이트
                }
            });

            const camera = new cam.Camera(videoElement2.current, {
                onFrame: async () => {
                    await faceMesh.send({ image: videoElement2.current });
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
            if (canvasRef.current) {
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext('2d');
            
            if (videoElement2.current) {
                canvasCtx.drawImage(videoElement2.current, 0, 0, canvasElement.width, canvasElement.height);
            }
        }
            requestAnimationFrame(renderFrame);
        };

        renderFrame();
    }, []);

    return (
        <div id={"camera-" + participantIdentity} className="video-container">
            <div className="participant-data">
                <p>{participantIdentity + (local ? " (You)" : "")}</p>
            </div>
            <video ref={videoElement2} id={track.sid} style={{ display: 'none' }}></video>
            {/* display none */}
            <canvas ref={canvasRef} className="output_canvas" width="1280" height="720" style={{ transform: 'scaleX(-1)', display: 'none' }}></canvas>
            <RedFox landmarks={landmarks} videoElement={videoElement2} />
            {/* {mask === 'redfox' && <RedFox landmarks={landmarks} videoElement={videoElement} />}
            {mask === 'spiderman' && <SpiderMan landmarks={landmarks} videoElement={videoElement} />} */}
        </div>
    );
}

export default VideoComponent;
