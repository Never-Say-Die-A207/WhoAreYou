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
import api from '../../api/api';
import { PropagateLoader } from 'react-spinners';

import RedFoxLocal from './RedFoxLocal';
import SpiderManLocal from './SpiderManLocal';
import VerticalCarousel from './VerticalCarousel';
import MobileCarousel from './MobileCarousel';
import JokerLocal from './JokerLocal';
import PinkFoxLocal from './PinkFoxLocal';
import SpiderManBlackLocal from './SpiderManBlackLocal';
import SquidLocal from './SquidLocal';
import RedFoxRemote from './RedFoxRemote';

// 반응형
import { useMediaQuery, MediaQuery } from 'react-responsive';



var APPLICATION_SERVER_URL = "http://3.36.120.21:4040/";
var LIVEKIT_URL = "wss://myapp-yqvsqxqi.livekit.cloud/";

// let APPLICATION_SERVER_URL = "";
// let LIVEKIT_URL = "";

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

    const [roomId, setRoomId] = useState('');
    const [myId, setMyId] = useState('');
    const [partnerId, setPartnerId] = useState('');


    // 미리보기 코드
    const [previewStream, setPreviewStream] = useState(null);
    const videoPreviewRef = useRef(null);
    const [landmarks, setLandmarks] = useState(null);
    const [loading, setLoading] = useState(true);
    // const loading = false

    //반응형
    const isSmallScreen = useMediaQuery({ maxWidth: 576 });

    //룸시작 코드
    // function changeLoaclMaskValue(e) {
    //     setMask(e.target.value)
    // };


    // 타이머
    const [timeLeft, setTimeLeft] = useState(1000); // 3분 = 180초로 변경
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);


    // 친구 추가 토글 상태
    const [isFriend, setIsFriend] = useState(false);


    //매칭 시작 시간


    async function joinRoom() {
        const room = new Room();
        setRoom(room);

        // room.on(RoomEvent.TrackSubscribed, async (track, _publication, participant) => {
        //     if(room.remoteParticipants.size){
        //         const roomInfo = await getRoomInfo(document.getElementById("participant-name").value);
        //         console.log('roominfo')
        //         console.log(roomInfo);
        //     }
        //     // addTrack(track, participant.identity);
        //     }
        // );
        // setLoading(room.remoteParticipants.size);
        // console.log(room.remoteParticipants);
        // console.log(loading);

        room.on(
            RoomEvent.TrackSubscribed,
            (_track, publication, participant) => {
                setRemoteTracks((prev) => [
                    ...prev,
                    { trackPublication: publication, participantIdentity: participant.identity }
                ]);

                const userId = localStorage.getItem('userId')
                const body = getRoomInfo(userId)
                console.log(body)
            }
        );
        console.log(room.remoteParticipants.size);
        room.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
            setRemoteTracks((prev) => prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid));
        });

        try {
            const token = await getToken(mask, participantName);
            await room.connect(LIVEKIT_URL, token);
            await room.localParticipant.enableCameraAndMicrophone();
            setLocalTrack(room.localParticipant.videoTrackPublications.values().next().value.videoTrack);
            console.log(room.remoteParticipants);
            // setLoading(room.remoteParticipants.size)
            // if (room.remoteParticipants.size > 0) {
            //     setLoading(false)
            // } 

        } catch (error) {
            console.log('There was an error connecting to the room:', error.message);
            await leaveRoom();
        }
    }

    async function leaveRoom() {
        // Leave the room by calling 'disconnect' method over the Room object
        // Stop local video and audio tracks

        await quit();

        await room?.disconnect();
        // Reset the state
        setRoom(undefined);
        setLocalTrack(undefined);
        setRemoteTracks([]);
        stopTimer();
        window.location.reload();
    }

    async function getRoomInfo(participantName) {
        setLoading(true)
        var requestURL = APPLICATION_SERVER_URL + 'facechat/info/' + participantName;
        const response = await fetch(requestURL, {
            headers: {
                'ngrok-skip-browser-warning': 'skip-browser-warning'
            },
        });

        const body = await response.json();
        console.log('상대방 마스크 정보')
        console.log(body.info.mask)
        setMaskRemote(body.info.mask);
        console.log('매칭 시작 시간')
        console.log(body.info.startedAt)

        if (body.info.mask) {
            setRoomId(body.info.roomId);
            setPartnerId(body.info.partnerId);


            setLoading(false)
            // 타이머 시작
            startTimer();
        }
        return body;
    }

    //마스크 이름 넣기 주석 
    async function getToken(mask, participantName) {
        const userId = localStorage.getItem('userId')
        console.log('내 마스크 정보')
        console.log(mask)
        // // // 다른 사람 통신 주석
        const mask_data = {
            'userId': userId,
            'mask': mask,
            'needsChange': false,
        };

        const response = await fetch(APPLICATION_SERVER_URL + 'facechat/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mask_data)
        }
        );


        // const response = await fetch(APPLICATION_SERVER_URL + 'token', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         roomName: roomName,
        //         participantName: participantName
        //     })
        // });

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
            // videoPreviewRef.current = camera
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

    async function quit() {
        const userId = localStorage.getItem('userId');
        const response = await fetch(APPLICATION_SERVER_URL + 'facechat/' + userId, {
            method: 'DELETE'
        }
        );

        return response;
    }



    const startTimer = () => {
        startTimeRef.current = Date.now();
        setTimeLeft(1000); // 타이머 초기화 - 3분(180초)로 변경

        const updateTimer = () => {
            const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
            setTimeLeft(1000 - elapsedTime); // 3분(180초)으로 변경

            if (elapsedTime < 1000) { // 3분(180초)으로 변경
                timerRef.current = requestAnimationFrame(updateTimer);
            } else {
                handleTimerEnd(); // 타이머가 끝났을 때 실행할 함수 호출
            }
        };

        timerRef.current = requestAnimationFrame(updateTimer);
    };


    // 타이머 친구 추가 api요청 보내기
    // const response = await fetch(APPLICATION_SERVER_URL + 'facechat/result/', {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(room_id, my_id, remote_id, isfriend: friend)
    // }


    //타이머 끝나는 경우 코드 실행    
    const handleTimerEnd = async () => {
        const finalResult = {
            roomId,
            myId,
            partnerId,
            'friend': isFriend,
        };

        try {
            const response = await api.post('/facechat/result/', finalResult);
            if (response.message === 'OK') {
                console.log('OK')
            } else if (response.message === 'NO') {

            };
        } catch (error) {
            console.log(error)
        }
        // 추가로 API 요청을 여기에 작성
        // await api.post('/some-endpoint', { data: 'some data' });
        leaveRoom(); // 타이머가 끝났을 때 방 나가기
    };


    // 타이머 중지
    const stopTimer = () => {
        if (timerRef.current) {
            cancelAnimationFrame(timerRef.current);
            timerRef.current = null;
        }
    };

    // 타이머 포맷팅
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };


    // 친구 토글
    const handleFriendToggle = () => {
        setIsFriend(!isFriend);
    };


    return (
        <>
            {!room ? (
                <div id='join'>
                    {/* <JokerLocal landmarks={landmarks} videoElement3={videoPreviewRef} /> */}
                    {/* <RedFoxLocal landmarks={landmarks} videoElement3={videoPreviewRef}/> */}
                    {/* 슬라이더 만들기 */}

                    {/* 방 입장 시작 */}
                    <div id='join-dialog'>
                        {/* 가면 미리보기 보는 화면 */}
                        <div style={{ position: 'relative', height: '92vh' }}>
                            {isSmallScreen ? (
                                <MobileCarousel setMask={setMask} />
                            ) : (
                                <VerticalCarousel setMask={setMask} />
                            )}

                            <video ref={videoPreviewRef} autoPlay muted style={{
                                width: '100%', height: '100%', transform: 'scaleX(-1)', visibility: 'hidden',
                            }}></video>
                            {/* <RedFoxRemote landmarks={landmarks} videoElement={videoPreviewRef} /> */}
                            {/* <canvas ref={canvasRef} className="output_canvas" width="1280" height="720" style={{ position: 'absolute', top: 0, left: 0 }}></canvas> */}
                            {mask === 'RedFox' && <RedFoxLocal landmarks={landmarks} videoElement={videoPreviewRef} />}
                            {mask === 'SpiderMan' && <SpiderManLocal landmarks={landmarks} videoElement={videoPreviewRef} />}
                            {mask === 'Joker' && <JokerLocal landmarks={landmarks} videoElement={videoPreviewRef} />}
                            {/* {mask === 'PinkFox' && <PinkFoxLocal landmarks={landmarks} videoElement3={videoPreviewRef} />} */}
                            {mask === 'SpiderManBlack' && <SpiderManBlackLocal landmarks={landmarks} videoElement={videoPreviewRef} />}
                            {mask === 'Squid' && <SquidLocal landmarks={landmarks} videoElement={videoPreviewRef} />}
                            {isSmallScreen ? (
                                // 모바일 꾸미기
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        joinRoom();
                                        // stopPreview();
                                    }}
                                    className='video-form-mobile'>
                                    {/* <div>
                            <label htmlFor='mask-name'>마스크 변경</label>
                            <select
                                id='mask-name'
                                className='form-control'
                                value={mask}
                                onChange={changeLoaclMaskValue}
                            > */}
                                    {/* <option value='' defaultValue='마스크 선택'>마스크 선택</option> */}
                                    {/* <option value='RedFox'>RedFox</option>
                                <option value="SpiderMan">SpiderMan</option>
                            </select>
                            </div> */}
                                    {/* <div>
                                        <label htmlFor='participant-name'>Participant</label>
                                        <input
                                            id='participant-name'
                                            className='form-control'
                                            type='text'
                                            value={participantName}
                                            onChange={(e) => setParticipantName(e.target.value)}
                                            required
                                        />
                                    </div> */}
                                    {/* <div>
                                        <label htmlFor='room-name'>Room</label>
                                        <input
                                            id='room-name'
                                            className='form-control'
                                            type='text'
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            required
                                        />
                                    </div> */}

                                    <button
                                        className='btn-mobile btn-lg-mobile btn-success-mobile'
                                        type='submit'
                                        disabled={!roomName || !participantName}
                                    >
                                        매칭!
                                    </button>
                                </form>
                            ) : (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        joinRoom();
                                        // stopPreview();
                                    }}
                                    className='video-form'>
                                    <button
                                        className='btn btn-lg btn-success'
                                        type='submit'
                                        disabled={!roomName || !participantName}
                                    >
                                        매칭 시작!
                                    </button>

                                </form>
                            )}

                        </div>

                    </div>
                </div>
            ) : (
                loading ? (
                    <div id='loading'>
                        <div>
                            <PropagateLoader
                                color="#aa4dcb"
                                size={25}
                            />
                        </div>
                        <div className="loading-text">상대방을 찾고 있습니다.</div>
                    </div>
                ) : (
                    <div>
                        <div style={{ position: 'relative' }}>
                        <div id='timer'>남은 시간 : {formatTime(timeLeft)}</div>
                            <div id='room'>
                                <div id='room-header'>
                                    {/* <h2 id='room-title'>{roomName}</h2> */}

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
                            </div>
                            <div className='bottom'>
                                <RoomBottom expressionData={expressionData} leaveRoom={leaveRoom}/>
                                {/* <button className='btn btn-danger' id='leave-room-button' onClick={leaveRoom}>
                                    Leave Room
                                </button> */}
                            </div>
                           

                        </div>
                        <div className='friend-toggle'>
                            <label>
                                <input type='checkbox' checked={isFriend} onChange={handleFriendToggle} />
                                친구 추가
                            </label>
                        </div>
                    </div>

                )
            )
            }
        </>
    );
}

export default OpenVidu;
