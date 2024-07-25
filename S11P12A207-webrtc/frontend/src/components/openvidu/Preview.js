import React, { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import RedFoxLocal from './RedFoxLocal';
import SpiderManLocal from './SpiderManLocal';

const Preview = ({ setMask, mask }) => {
    const [previewStream, setPreviewStream] = useState(null);
    const videoPreviewRef = useRef(null);
    const canvasRef = useRef(null);
    const [landmarks, setLandmarks] = useState(null);

    useEffect(() => {
        startPreview();
        return () => stopPreview();
    }, []);

    useEffect(() => {
        if (videoPreviewRef.current && previewStream) {
            videoPreviewRef.current.srcObject = previewStream;
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

                    // Draw the video frame to the canvas
                    canvasCtx.drawImage(videoPreviewRef.current, 0, 0, canvasElement.width, canvasElement.height);

                    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                        const landmarks = results.multiFaceLandmarks[0];
                        setLandmarks(landmarks);
                    }
                }
            });

            const camera = new cam.Camera(videoPreviewRef.current, {
                onFrame: async () => {
                    await faceMesh.send({ image: videoPreviewRef.current });
                },
                width: 1280,
                height: 720,
            });
            camera.start();
        }
    }, [previewStream]);

    const startPreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setPreviewStream(stream);
        } catch (error) {
            console.error('Error accessing webcam: ', error);
        }
    };

    const stopPreview = () => {
        if (previewStream) {
            previewStream.getTracks().forEach(track => track.stop());
            setPreviewStream(null);
        }
    };

    const changeLocalMaskValue = (e) => {
        setMask(e.target.value);
    };

    return (
        <div>
            <h3>Preview</h3>
            <video ref={videoPreviewRef} autoPlay muted style={{ width: '100%', height: 'auto' }}></video>
            <canvas ref={canvasRef} className="output_canvas" width="1280" height="720" style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
            {mask === 'RedFox' && <RedFoxLocal landmarks={landmarks} videoElement={videoPreviewRef} />}
            {mask === 'SpiderMan' && <SpiderManLocal landmarks={landmarks} videoElement={videoPreviewRef} />}
            <div>
                <label htmlFor='mask-name'>마스크 변경</label>
                <select
                    id='mask-name'
                    className='form-control'
                    value={mask}
                    onChange={changeLocalMaskValue}
                >
                    <option value='RedFox'>RedFox</option>
                    <option value='SpiderMan'>SpiderMan</option>
                </select>
            </div>
        </div>
    );
};

export default Preview;
