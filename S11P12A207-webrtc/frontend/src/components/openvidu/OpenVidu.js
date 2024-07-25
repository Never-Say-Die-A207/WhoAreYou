import React, { useState, useRef, useEffect } from 'react';
import {
    LocalVideoTrack,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent
} from 'livekit-client';
import './OpenVidu.css';
import VideoComponent from './VideoComponent';
import VideoComponentLocal from './VideoComponentLocal';
import AudioComponent from './AudioComponent';
import RoomBottom from './RoomBottom';
import FaceRecognition from './FaceRecognition';
import Preview from './Preview';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import RedFoxLocal from './RedFoxLocal';
import SpiderManLocal from './SpiderManLocal';

// var APPLICATION_SERVER_URL = "https://grown-donkey-awfully.ngrok-free.app/";
// var LIVEKIT_URL = "wss://myapp-yqvsqxqi.livekit.cloud/";

let APPLICATION_SERVER_URL = "";
let LIVEKIT_URL = "";

configureUrls();


//  openvidu

function configureUrls() {
    if (!APPLICATION_SERVER_URL) {
        if (window.location.hostname === 'localhost') {
            APPLICATION_SERVER_URL = 'http://localhost:6080/';
        } else {
            APPLICATION_SERVER_URL = 'https://' + window.location.hostname + ':6443/';
        }
    }

    if (!LIVEKIT_URL) {
        if (window.location.hostname === 'localhost') {
            LIVEKIT_URL = 'ws://localhost:7880/';
        } else {
            LIVEKIT_URL = 'wss://' + window.location.hostname + ':7443/';
        }
    }
}

function OpenVidu() {
    const [room, setRoom] = useState(undefined);
    const [localTrack, setLocalTrack] = useState(undefined);
    const [remoteTracks, setRemoteTracks] = useState([]);
    const [expressionData, setExpressionData] = useState({ borderClass: '', imageSrc: null }); // New state for expression data

    const [participantName, setParticipantName] = useState('Participant' + Math.floor(Math.random() * 100));
    const [roomName, setRoomName] = useState('Test Room');

    const [mask, setMask] = useState('RedFox');
    const [maskRemote, setMaskRemote] = useState('');

    // 미리보기 코드
    const [previewStream, setPreviewStream] = useState(null);
    const videoPreviewRef = useRef(null);
    const canvasRef = useRef(null);
    const [landmarks, setLandmarks] = useState(null);

    //룸시작 코드

    function changeLoaclMaskValue(e) {
        setMask(e.target.value)
    };

    async function joinRoom() {
        const room = new Room();
        setRoom(room);

        room.on(
            RoomEvent.TrackSubscribed,
            (_track, publication, participant) => {
                setRemoteTracks((prev) => [
                    ...prev,
                    { trackPublication: publication, participantIdentity: participant.identity }
                ]);
                const body = getRoomInfo(participantName)
                console.log(body)
            }
        );

        room.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
            setRemoteTracks((prev) => prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid));
        });

        try {
            const token = await getToken(mask, participantName);
            await room.connect(LIVEKIT_URL, token);
            await room.localParticipant.enableCameraAndMicrophone();
            setLocalTrack(room.localParticipant.videoTrackPublications.values().next().value.videoTrack);
        } catch (error) {
            console.log('There was an error connecting to the room:', error.message);
            await leaveRoom();
        }
    }

    async function leaveRoom() {
        // Leave the room by calling 'disconnect' method over the Room object
        // Stop local video and audio tracks

        await room?.disconnect();
        // Reset the state
        setRoom(undefined);
        setLocalTrack(undefined);
        setRemoteTracks([]);
        window.location.reload();
    }

    async function getRoomInfo(participantName) {
        var requestURL = APPLICATION_SERVER_URL + 'facechat/info/' + participantName;
        const response = await fetch(requestURL, {
            headers: {
                'ngrok-skip-browser-warning': 'skip-browser-warning'
            },
        });

        const body = await response.json();
        console.log('상대방 마스크 정보')
        console.log(body)
        setMaskRemote(body.info.mask);
        return body;
    }

    //마스크 이름 넣기 주석 
    async function getToken(mask, participantName) {
        console.log('내 마스크 정보')
        console.log(mask)
        // // 다른 사람 통신 주석
        // const mask_data = {
        //     'userId': participantName,
        //     'mask': mask,
        // };

        // const response = await fetch(APPLICATION_SERVER_URL + 'facechat/', {
        //         method: 'POST',
        //         headers: {
        //             "Content-Type": "application/json",
        //             'ngrok-skip-browser-warning': 'skip-browser-warning'
        //         },
        //         body: JSON.stringify(mask_data)
        //     }
        // );


        const response = await fetch(APPLICATION_SERVER_URL + 'token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomName: roomName,
                participantName: participantName
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to get token: ${error.errorMessage}`);
        }

        const data = await response.json();
        return data.token;
    }

    //미리보기 코드
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
                if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                    const landmarks = results.multiFaceLandmarks[0];
                    setLandmarks(landmarks);
                }
            });

            const camera = new cam.Camera(videoPreviewRef.current, {
                onFrame: async () => {
                    if (videoPreviewRef.current) {
                        await faceMesh.send({ image: videoPreviewRef.current });
                    }
                },
                width: 1280,
                height: 720,
            });
            camera.start();
        }
    }, [previewStream, videoPreviewRef]);  // videoPreviewRef도 의존성 배열에 추가


    const startPreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    aspectRatio: 16 / 9
                }
            });
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






    return (
        <>
            {!room ? (
                <div id='join'>
                    <div id='join-dialog'>
                        <h2>Join a Video Room</h2>
                        <div style={{ position: 'relative' }}>
                            <video ref={videoPreviewRef} autoPlay muted style={{
                                width: '100%', height: 'auto', transform: 'scaleX(-1)'
                            }}></video>
                            {/* <canvas ref={canvasRef} className="output_canvas" width="1280" height="720" style={{ position: 'absolute', top: 0, left: 0 }}></canvas> */}
                            {mask === 'RedFox' && <RedFoxLocal landmarks={landmarks} videoElement3={videoPreviewRef} />}
                            {mask === 'SpiderMan' && <SpiderManLocal landmarks={landmarks} videoElement3={videoPreviewRef} />}
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                joinRoom();
                                // stopPreview();
                            }}
                        >
                            <div>
                                <label htmlFor='mask-name'>마스크 변경</label>
                                <select
                                    id='mask-name'
                                    className='form-control'
                                    value={mask}
                                    onChange={changeLoaclMaskValue}
                                >
                                    {/* <option value='' defaultValue='마스크 선택'>마스크 선택</option> */}
                                    <option value='RedFox'>RedFox</option>
                                    <option value="SpiderMan">SpiderMan</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor='participant-name'>Participant</label>
                                <input
                                    id='participant-name'
                                    className='form-control'
                                    type='text'
                                    value={participantName}
                                    onChange={(e) => setParticipantName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor='room-name'>Room</label>
                                <input
                                    id='room-name'
                                    className='form-control'
                                    type='text'
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                className='btn btn-lg btn-success'
                                type='submit'
                                disabled={!roomName || !participantName}
                            >
                                Join!
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div id='room'>
                    <div id='room-header'>
                        <h2 id='room-title'>{roomName}</h2>
                        <button className='btn btn-danger' id='leave-room-button' onClick={leaveRoom}>
                            Leave Room
                        </button>
                    </div>
                    <div id='layout-container'>
                        {localTrack && (
                            <VideoComponentLocal track={localTrack} participantIdentity={participantName} local={true} mask={mask} />
                        )}
                        {remoteTracks.map((remoteTrack) =>
                            remoteTrack.trackPublication.kind === 'video' ? (
                                <VideoComponent
                                    key={remoteTrack.trackPublication.trackSid}
                                    track={remoteTrack.trackPublication.videoTrack}
                                    participantIdentity={remoteTrack.participantIdentity}
                                    setExpressionData={setExpressionData} // setExpressionData 전달
                                    maskRemote={maskRemote}
                                />

                            ) : (
                                <AudioComponent
                                    key={remoteTrack.trackPublication.trackSid}
                                    track={remoteTrack.trackPublication.audioTrack}
                                />
                            )
                        )}
                    </div>
                    <div className='room-bottom'>
                        <RoomBottom expressionData={expressionData} />
                    </div>
                </div>
            )}
        </>
    );
}

export default OpenVidu;
