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
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import RedFoxLocal from './RedFoxLocal';
import SpiderManLocal from './SpiderManLocal';
import VerticalCarousel from './VerticalCarousel';
import MobileCarousel from './MobileCarousel';
import JokerLocal from './JokerLocal';
import PinkFoxLocal from './PinkFoxLocal';
import SpiderManBlackLocal from './SpiderManBlackLocal';
import SquidLocal from './SquidLocal';
import RedFoxRemote from './RedFoxRemote';
import ModalComponent from './ModalComponent';
import '../../pages/Modal.css';
// 반응형
import { useMediaQuery, MediaQuery } from 'react-responsive';
import Webcam from "react-webcam";


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
    const videoRef = useRef(null);
    const faceLandmarkerRef = useRef(null);
    const lastVideoTimeRef = useRef(-1);

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

    const [stage1, setstage1] = useState(false);
    const stage1_ref = useRef(false);
    const [stage2, setstage2] = useState(false);
    const stage2_ref = useRef(false);
    const [stage3, setstage3] = useState(false);
    const stage3_ref = useRef(false);
    const [fadeOut, setFadeOut] = useState(false);


    // 친구 추가 토글 상태
    const [isFriend, setIsFriend] = useState(false);
    const isFriendRef = useRef(isFriend);
    const isFriend_axios = useRef(false);
    const getfriend_result = useRef(false)

    const gender = useRef('')

    const userId = localStorage.getItem('userId');
    const refreshToken = localStorage.getItem('refreshToken');
    const navigate = useNavigate();
    const friendResultRef = useRef(false);



    //모달
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTF, setModalTF] = useState(false);
    const leavemodal = useRef(false);
    //매칭 시작 시간

    async function joinRoom() {
        if (!refreshToken) {
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
        const setup = async () => {
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


            if (videoPreviewRef.current) {
                navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 },
                    audio: false,
                    aspectRatio: 16 / 9,
                }).then(stream => {
                    videoPreviewRef.current.srcObject = stream;
                    videoPreviewRef.current.addEventListener('loadeddata', () => {
                        // 비디오 로드 완료 후 예측 시작
                        if (videoPreviewRef.current) {
                            startPrediction();
                        }
                    });
                }).catch(error => {
                    console.error("Error accessing media devices.", error);
                });
            }

        };

        const startPrediction = () => {
            const predict = async () => {
                if (videoPreviewRef.current) {
                    const nowInMs = Date.now();
                    if (lastVideoTimeRef.current !== videoPreviewRef.current.currentTime) {
                        lastVideoTimeRef.current = videoPreviewRef.current.currentTime;
                        if (faceLandmarkerRef.current) {
                            const faceLandmarkerResult = await faceLandmarkerRef.current.detectForVideo(videoPreviewRef.current, nowInMs);
                            // console.log(faceLandmarkerResult.faceLandmarks[0]);
                            setLandmarks(faceLandmarkerResult.faceLandmarks[0])
                        }
                    }
                }
                // 예측을 계속하기 위해 requestAnimationFrame을 사용합니다.
                window.requestAnimationFrame(predict);
            };

            predict(); // 예측 함수 시작
        };

        setup();

        // 컴포넌트가 언마운트될 때 비디오 스트림을 중지하고 자원을 해제합니다.
        return () => {
            if (videoPreviewRef.current && videoPreviewRef.current.srcObject) {
                const stream = videoPreviewRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoPreviewRef.current.srcObject = null;
            }
        };
    }, []); // 빈 배열을 사용하여 컴포넌트가 마운트될 때만 실행합니다.




    // 미리보기 코드
    // useEffect(() => {
    //     startPreview();
    //     return () => stopPreview();
    // }, []);

    // useEffect(() => {
    //     if (videoPreviewRef.current && previewStream) {
    //         videoPreviewRef.current.srcObject = previewStream;
    //         const faceMesh = new FaceMesh({
    //             locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    //         });
    //         console.log(faceMesh)

    //         faceMesh.setOptions({
    //             maxNumFaces: 1,
    //             minDetectionConfidence: 0.5,
    //             minTrackingConfidence: 0.5,
    //         });

    //         faceMesh.onResults((results) => {
    //             if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    //                 const landmarks = results.multiFaceLandmarks[0];
    //                 setLandmarks(landmarks);
    //                 console.log(landmarks)
    //             }
    //         });


    //         const camera = new cam.Camera(videoPreviewRef.current, {
    //             onFrame: async () => {
    //                 if (videoPreviewRef.current) {
    //                     await faceMesh.send({ image: videoPreviewRef.current });
    //                 }
    //             },
    //             width: 1280,
    //             height: 720,
    //         });
    //         camera.start();
    //         // videoPreviewRef.current = camera
    //     }
    // }, [previewStream, videoPreviewRef]);  // videoPreviewRef도 의존성 배열에 추가


    // const startPreview = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({
    //             video: {
    //                 width: { ideal: 1280 },
    //                 height: { ideal: 720 },
    //                 aspectRatio: 16 / 9
    //             }
    //         });
    //         setPreviewStream(stream);
    //     } catch (error) {
    //         console.error('Error accessing webcam: ', error);
    //     }
    // };

    // const stopPreview = () => {
    //     if (previewStream) {
    //         previewStream.getTracks().forEach(track => track.stop());
    //         setPreviewStream(null);
    //     }
    // };



    //미리보기 코드 끝




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

            if (newTimeLeft == 25) {
                if (stage1_ref.current == false) {
                    showNotification();
                    stage1_ref.current = true;
                }
            }
            if (newTimeLeft == 10) {
                if (stage2_ref.current == false) {
                    showNotification2();
                    stage2_ref.current = true;
                }
            }
            // if (newTimeLeft == 30) {
            //     if (stage3_ref.current == false) {
            //         showNotification3();
            //         stage3_ref.current = true;
            //     }
            // }

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
                if (newTimeLeft == 5) {
                    if (getfriend_result.current == false) {
                        getFriendResult(pi)
                        getfriend_result.current = true;
                    }
                }
            } else if (gender.current == 'female') {
                if (newTimeLeft == 7) {

                    if (isFriend_axios.current == false) {
                        handleTimerEnd(ri, pi);
                        isFriend_axios.current = true;
                    }
                }
                if (newTimeLeft == 3) {
                    if (getfriend_result.current == false) {
                        getFriendResult(pi)
                        getfriend_result.current = true;
                    }
                }
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
                localStorage.setItem('showModelSt', 'true');
                if (friendResultRef.current == true) {
                    localStorage.setItem('isfriendSt', 'true')
                } else {
                    localStorage.setItem('isfriendSt', 'false')
                }
                //친구 결과 확인해서 화면에 표시
                leaveRoom();
                // handleTimerEnd(ri, pi); // 타이머가 끝났을 때 실행할 함수 호출
                // 1초 후에 실행
            }
        };

        timerRef.current = requestAnimationFrame(updateTimer);
    };


    // 안내 문구
    // const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        // 로컬 스토리지에서 방을 떠났는지 확인
        const showModelSt = localStorage.getItem('showModelSt');
        const isfriendSt = localStorage.getItem('isfriendSt');
        console.log('로컬')
        console.log(isfriendSt)
        console.log(showModelSt)
        if (showModelSt === 'true') {
            if (isfriendSt === 'true') {
                setModalMessage('친구 성공!!');
                setShowModal(true);
                setModalTF(true);
            } else {
                setModalMessage('친구 실패 ㅠㅠ');
                setShowModal(true);
                setModalTF(false);
            }
            localStorage.removeItem('showModelSt'); // 모달을 띄운 후 상태 초기화
            localStorage.removeItem('isfriendSt'); // 모달을 띄운 후 상태 초기화
        }
    }, []);


    const showNotification = () => {
        setstage1(true);  // 안내 문구 표시
        setFadeOut(false);  // fade-out 리셋
        setTimeout(() => {
            setFadeOut(true);  // 2.5초 후 fade-out 시작
            setTimeout(() => {
                setstage1(false);  // 애니메이션 후 안내 문구 숨김
            }, 500);  // 애니메이션이 끝날 때까지 0.5초 대기
        }, 10000);  // 2.5초 동안 문구 표시 후 fade-out 시작
    };

    const showNotification2 = () => {
        setstage2(true);  // 안내 문구 표시
        setFadeOut(false);  // fade-out 리셋
        setTimeout(() => {
            setFadeOut(true);  // 2.5초 후 fade-out 시작
            setTimeout(() => {
                setstage2(false);  // 애니메이션 후 안내 문구 숨김
            }, 500);  // 애니메이션이 끝날 때까지 0.5초 대기
        }, 3000);  // 2.5초 동안 문구 표시 후 fade-out 시작
    };

    const showNotification3 = () => {
        setstage3(true);  // 안내 문구 표시
        setFadeOut(false);  // fade-out 리셋
        setTimeout(() => {
            setFadeOut(true);  // 2.5초 후 fade-out 시작
            setTimeout(() => {
                setstage3(false);  // 애니메이션 후 안내 문구 숨김
            }, 500);  // 애니메이션이 끝날 때까지 0.5초 대기
        }, 3000);  // 2.5초 동안 문구 표시 후 fade-out 시작
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

        fetch(APPLICATION_SERVER_URL + 'facechat/friend', {
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

    const getFriendResult = async (pi) => {
        const myId = localStorage.getItem('userId')
        const partnerId = pi;
        const response = await api.get(`/friends/result?myId=${myId}&partnerId=${partnerId}`);
        if (response.data.result == true) {
            friendResultRef.current = true
        } else {
            friendResultRef.current = false
        }
        console.log('친구 여부')
        console.log(friendResultRef.current)
        console.log(response.data);
    }

    const RematchModal = () => {
        setShowModal(false);
        joinRoom();
    };

    const closeModal = () => {
        setShowModal(false);
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
                                    {refreshToken &&
                                        <li className="nav-item">
                                            <Link to='/mypage' className='nav-link' onClick={leaveRoom}>채팅하기</Link>
                                        </li>
                                    }

                                </ul>
                            </div>
                            <div>
                                {!refreshToken && <ul className="navbar-nav ml-auto">
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
                <div>
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
                                {/* <video className='camera-feed' id="video" ref={videoRef} autoPlay></video> */}
                                {/* <Webcam ref={videoPreviewRef}/> */}
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
                    {showModal && (
                        <div className="my-overlay" style={{ zIndex: '100' }}>
                            <div className="my-modal" style={{ position: 'relative' }}>
                                <button className="close-x-button" onClick={closeModal}>×</button>
                                <h2 style={{ color: 'white', marginBottom: '20px', marginTop: '20px' }}><strong>{modalMessage}</strong></h2>
                                {/* <div className="my-info-content">
                                    <div className="info-box" style={{ justifyContent: 'center' }}>
                                        <p>{modalMessage}</p>
                                    </div>
                                </div> */}
                                {/* <button className="close" onClick={closeModal}>확인</button> */}
                                <div className='modalbutton'>
                                    {modalTF ? (
                                        <div>
                                            <button className="close">
                                                <Link to='/mypage' className='nav-link'>채팅하기</Link>
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button className="close" onClick={RematchModal}>매칭하기</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
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
                            {/* 안내문구 */}
                            <div className="stage-container">
                                {stage1 && (
                                    <div className={`stage-notification ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                                        <div className="stage-title">친구 선택</div>
                                        <h2 className="stage-description">10초 동안 친구 여부를 고르세요</h2>
                                        <p className='stage-alert'>*이후에는 선택 불가*</p>
                                    </div>
                                )}
                                {/* <button className="show-button" onClick={showNotification}>Show Stage Again</button> */}
                            </div>
                            <div className="stage-container">
                                {stage2 && (
                                    <div className={`stage-notification ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                                        <div className="stage-title">친구 결과</div>
                                        <div className="stage-description">10초 후에 공개 됩니다</div>
                                    </div>
                                )}
                            </div>
                            {/* <div className="stage-container">
                                {stage3 && (
                                    <div className={`stage-notification ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                                        <div className="stage-title">Stage 3</div>
                                        <div className="stage-description">20초 동안 선택의 시간</div>
                                    </div>
                                )}
                            </div> */}
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
                                <RoomBottom expressionData={expressionData} leaveRoom={leaveRoom} />
                                
                                {/* <button className='btn btn-danger' id='leave-room-button' onClick={leaveRoom}>
                                    Leave Room
                                </button> */}
                            </div>


                        </div>

                        {isFriend10second ? (
                            <></>
                            // <label>친구 여부 10초 후에 공개!</label>
                        ) : (
                            <div className='friend-toggle'>
                                <label>
                                    <input type='checkbox' onClick={toggleIsFriend} />
                                    친구 추가
                                </label>
                            </div>
                        )}
                    </div>

                )
            )
            }
        </>
    );
}

export default OpenVidu;