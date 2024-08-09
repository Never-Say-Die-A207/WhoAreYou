import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LocalVideoTrack,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent
} from 'livekit-client';
import './OpenVidu.css';
import '../../pages/Navbar.css';
import VideoComponent from './VideoComponent';
import VideoComponentLocal from './VideoComponentLocal';
import AudioComponent from './AudioComponent';
import RoomBottom from './RoomBottom';
import FaceRecognition from './FaceRecognition';
import EmotionBarChart from './EmotionBarChart';
import Preview from './Preview';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import api from '../../api/api';
import { PropagateLoader } from 'react-spinners';
import { CiLogout } from "react-icons/ci";

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



// var APPLICATION_SERVER_URL = 'http://3.36.120.21:4040/api/';
// var LIVEKIT_URL = "wss://myapp-yqvsqxqi.livekit.cloud/";

var APPLICATION_SERVER_URL = 'https://i11a207.p.ssafy.io/api/';
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

    const [emotionCounts, setEmotionCounts] = useState({
        happy: 0,
        sad: 0,
        angry: 0,
        disgusted: 0,
        surprised: 0,
        fear: 0,
        neutral: 0,
    });

    const [participantName, setParticipantName] = useState('Participant' + Math.floor(Math.random() * 100));
    const [roomName, setRoomName] = useState('Test Room');

    const [mask, setMask] = useState('RedFox');
    const [maskRemote, setMaskRemote] = useState('');

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
    const [timeLeft, setTimeLeft] = useState(20); // 3분 = 180초로 변경
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const servertime = useRef(null)
    const [isFriend10second, setisFriend10second] = useState(false)

    // 친구 추가 토글 상태
    const [isFriend, setIsFriend] = useState(false);
    const isFriendRef = useRef(isFriend);
    const isFriend_axios = useRef(false)
    const isFriend_axios2 = useRef(false)
    const gender = useRef('')

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    //매칭 시작 시간

    async function joinRoom() {
        if (!token) {
            alert('로그인을 해주세요.');
            navigate('/');
        }
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

                const body = getRoomInfo(userId)
                console.log(body);
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


    function getRoomInfo(participantName) {
        setLoading(true);

        var requestURL = APPLICATION_SERVER_URL + 'facechat/info/' + participantName;

        fetch(requestURL, {
            headers: {
                'ngrok-skip-browser-warning': 'skip-browser-warning'
            },
        })
            .then(response => response.json())
            .then(body => {
                console.log('상대방 마스크 정보');
                console.log(body.info.mask);
                setMaskRemote(body.info.mask);
                console.log('매칭 시작 시간');
                console.log(body.info.startedAt);
                console.log('partnerId:', body.info.partnerId);
                console.log('roomId:', body.info.roomId);
                startTimeRef.current = new Date(body.info.startedAt).getTime(); // 시작 시간 설정
                gender.current = body.info.myGender;
                setLoading(false);
                // 타이머 시작
                startTimer(body.info.roomId, body.info.partnerId);

                return body;
            })
            .catch(error => {
                console.error('getRoomInfo error:', error);
            });
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
        )
        return response;
    }


    // 타이머 시작 함수 수정
    async function startTimer(ri, pi) {
        await fetch(APPLICATION_SERVER_URL + 'facechat/seconds/' + ri, {
            method: 'GET',
            // headers: {
            //     "Content-Type": "application/json",
            // },
        }
        ).then(response => response.json()
        )
            .then(seconds => {
                console.log('받아온 시간')
                console.log(seconds.seconds)
                servertime.current = seconds.seconds
                console.log('서버타임')
                console.log(servertime.current)
            })
            .catch(error => {
                console.error('getRoomInfo error:', error);
            });



        const currentTime = Date.now();

        const updateTimer = () => {
            const newElapsedTime = Math.floor((Date.now() - currentTime) / 1000);
            const newTimeLeft = servertime.current - newElapsedTime; // 다시 남은 시간 계산

            setTimeLeft(newTimeLeft > 0 ? newTimeLeft : 0); // 음수 방지, 0으로 설정
            // console.log(newTimeLeft)
            if (newTimeLeft == 10) {
                setisFriend10second(true)
            }
            if (gender.current == 'male') {
                if (newTimeLeft == 9) {

                    if (isFriend_axios.current == false) {
                        handleTimerEnd(ri, pi);
                        isFriend_axios.current = true;
                    }
                }
            } else if (gender.current == 'female') {
                if (newTimeLeft == 7) {

                    if (isFriend_axios.current == false) {
                        handleTimerEnd(ri, pi);
                        isFriend_axios.current = true;
                    }
                }
            }
            if (newTimeLeft == 5) {
                // 친구 추가 했어요?
            }
            if (newTimeLeft == 3) {
                // 친구 추가 했어요?
            }

            // if (newTimeLeft == 9) {

            //     if (isFriend_axios2.current == false) {
            //         handleTimerEnd(ri, pi);
            //         isFriend_axios2.current = true;
            //     }
            // }
            // if (newTimeLeft == 7 ) {
            //     if(isFriend_axios2.current == false) {

            //         handleTimerEnd(ri, pi);
            //         isFriend_axios2.current = true
            //     }
            // }
            if (newTimeLeft > 0) {
                timerRef.current = requestAnimationFrame(updateTimer);
            } else {
                leaveRoom();
                // handleTimerEnd(ri, pi); // 타이머가 끝났을 때 실행할 함수 호출
            }
        };

        timerRef.current = requestAnimationFrame(updateTimer);
    };


    // 타이머 끝나는 경우 코드 실행
    const handleTimerEnd = (roomId, partnerId) => {
        console.log("Final isFriend value:", isFriendRef.current); // C
        const finalResult = {
            'myId': userId,
            'partnerId': partnerId,
            'roomId': roomId,
            'friend': isFriendRef.current,
        };
        console.log(finalResult);

        fetch(APPLICATION_SERVER_URL + 'facechat/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalResult)
        })
            .then(response => response.json())
            .then(result => {
                if (result.message === 'OK') {
                    console.log('OK');
                } else if (result.message === 'NO') {
                    console.log('NO');
                }
            })
            .catch(error => {
                console.log('handleTimerEnd error:', error);
            });
        // leaveRoom();
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


    useEffect(() => {
        isFriendRef.current = isFriend;
    }, [isFriend]);

    // Function to toggle isFriend state and ref
    const toggleIsFriend = () => {
        setIsFriend(prev => {
            const newState = !prev;
            isFriendRef.current = newState; // Update the ref
            return newState;
        });
    };

    //매칭 취소
    const CancelMatching = () => {
        window.location.reload();
    };


    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{ padding: 0 }}>
                    <div className="container-fluid">
                        <Link to='/' className="navbar-brand" onClick={leaveRoom}>WHO ARE YOU</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <div>
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <Link to='/matching' className='nav-link' onClick={leaveRoom}>매칭하기</Link>
                                    </li>
                                    {token &&
                                        <li className="nav-item">
                                            <Link to='/mypage' className='nav-link' onClick={leaveRoom}>채팅하기</Link>
                                        </li>
                                    }

                                </ul>
                            </div>
                            <div>
                                {!token && <ul className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <Link to='/signup' className='nav-link' id='nav-signup'>회원가입</Link>
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        {/* {!token ? (
                        <Link to='/signup'>
                            <button
                                style={{
                                    cursor: 'pointer',
                                    color: 'white',
                                    backgroundColor: '#aa4dcb',
                                    fontSize: '1.2rem',
                                    width: '200px',
                                    height: '50px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    textAlign: 'center',
                                    fontWeight: '600'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(150, 60, 180)'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#aa4dcb'}
                            >
                                회원가입
                            </button>
                        </Link>
                    ) : (
                        <p>
                            방인원할까?
                        </p>
                    )} */}
                    </div>
                </nav>
            </header>
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
                                        상대방 찾기
                                    </button>

                                </form>
                            )}

                        </div>

                    </div>
                </div>
            ) : (
                loading ? (
                    <div id='loading'>
                        <div style={{ position: 'absolute', top: '2%', right: '1%' }}>
                            <button onClick={CancelMatching} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <CiLogout style={{ fontSize: '30px', transform: 'scaleX(-1)' }} />
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>

                            <PropagateLoader color="#aa4dcb" size={25} />
                            <div className="loading-text">상대방을 찾고 있습니다.</div>
                        </div>
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
                                                setEmotionCounts={setEmotionCounts}
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
                                {/* <RoomBottom expressionData={expressionData} leaveRoom={leaveRoom} /> */}
                                <EmotionBarChart emotionCounts={emotionCounts} />
                                {/* <button className='btn btn-danger' id='leave-room-button' onClick={leaveRoom}>
                                    Leave Room
                                </button> */}
                            </div>


                        </div>
                        <div className='friend-toggle'>
                            {isFriend10second ? (
                            <label>친구 여부 10초 후에 공개</label>
                            ) : (
                            <label>
                                <input type='checkbox' onClick={toggleIsFriend} />
                                친구 추가
                            </label>
                            )}
                        </div>
                    </div>

                )
            )
            }
        </>
    );
}

export default OpenVidu;