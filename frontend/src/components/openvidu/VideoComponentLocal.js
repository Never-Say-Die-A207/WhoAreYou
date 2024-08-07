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

function VideoComponentLocal({ track, participantIdentity, local = false, mask }) {
    const videoElement = useRef(null);
    const [landmarks, setLandmarks] = useState(null);

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
                setLandmarks(landmarks);
            }
        });

        const detectLandmarks = async () => {
            if (videoElement.current) {
                await faceMesh.send({ image: videoElement.current });
                requestAnimationFrame(detectLandmarks);
            }
        };

        if (videoElement.current) {
            videoElement.current.addEventListener('loadeddata', () => {
                detectLandmarks();
            });
        }

        return () => {
            if (faceMesh) {
                faceMesh.close();
            }
        };
    }, []);

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
