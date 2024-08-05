import React, { useState, useEffect } from 'react';
import FriendList from './FriendList';
import MessageList from './MessageList';
import Modal from 'react-modal';
import MyInfo from './MyInfo';
import api from '../api/api';
import SockJS from 'sockjs-client';

Modal.setAppElement('#root');

const Mypage = () => {
    const [messages, setMessages] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriendId, setSelectedFriendId] = useState(null);
    const [selectedFriendNickname, setSelectedFriendNickname] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [roomId, setRoomId] = useState(null)

    const userId = localStorage.getItem('userId');

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/friends/');
                const friendsData = response.data;
                setFriends(friendsData);
            } catch (error) {
                console.log('getFriends error:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedFriendId) {
            const fetchChatRoomAndHistory = async () => {
                try {
                    const chatRoomIdResponse = await api.get(`/chat-rooms/${selectedFriendNickname}`);
                    const chatRoomId = chatRoomIdResponse.data;
                    console.log('Chat room id:', chatRoomId);

                    const chatHistoryResponse = await api.post('/chat-rooms/historys', {
                        userId,
                        friendId: selectedFriendId
                    });
                    const chatHistory = chatHistoryResponse.data;
                    console.log('chat history:', chatHistory);
                    setRoomId(chatHistory);
                } catch (error) {
                    console.error('Error room or history:', error);
                }
            };

            fetchChatRoomAndHistory();
        }
    }, [selectedFriendId]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                userId,
                friendId: selectedFriendId,
                message: newMessage
            };

            setNewMessage('');
            setMessages(prevMessages => [...prevMessages, { ...message, sender: '나' }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFriendClick = (friendId, friendNickname) => {
        setSelectedFriendId(friendId);
        setSelectedFriendNickname(friendNickname);
    };

    const isFriendSelected = (friendId) => selectedFriendId === friendId;

    return (
        <div style={styles.container}>
            <div style={styles.friendSection}>
                <button
                    onClick={openModal}
                    style={isHovered ? styles.infoButtonHovered : styles.infoButton}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    내정보
                </button>
                <div style={styles.friendList}>
                    {friends.length === 0 ? (
                        <div style={styles.noFriendsMessage}>
                            친구가 없습니다. 친구를 추가하세요!
                        </div>
                    ) : (
                        <ul style={styles.friendListItems}>
                            {friends.map(friend => (
                                <li
                                    key={friend.id}
                                    style={isFriendSelected(friend.id) ? styles.selectedFriendListItem : styles.friendListItem}
                                    onClick={() => handleFriendClick(friend.id, friend.nickname)}
                                >
                                    {friend.nickname}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div style={styles.chatArea}>
                {selectedFriendId ? (
                    <>
                        {messages.length === 0 ? (
                            <div style={styles.noMessagesMessage}>
                                대화 내용이 없습니다. 먼저 채팅을 시작하세요!
                            </div>
                        ) : (
                            <MessageList messages={messages} />
                        )}
                        <div style={styles.inputContainer}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                                style={styles.input}
                                onKeyDown={handleKeyDown}
                            />
                            <button onClick={handleSendMessage} style={styles.sendButton}>
                                보내기
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={styles.selectFriendMessage}>
                        친구를 선택하세요.
                    </div>
                )}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="My Info Modal"
                className="my-modal"
                overlayClassName="my-overlay"
            >
                <MyInfo onClose={closeModal} />
            </Modal>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: 'calc(100vh - 60px)',
    },
    friendSection: {
        width: '20%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #ccc',
        padding: '10px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        height: 'calc(100vh - 60px)',
    },
    infoButton: {
        padding: '10px',
        border: '1px solid #ddd',
        marginBottom: '10px',
        cursor: 'pointer',
        backgroundColor: 'rgb(170, 77, 203)',
        color: 'white',
        fontSize: '16px',
        textAlign: 'center',
        display: 'block',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        width: '100%',
    },
    infoButtonHovered: {
        padding: '10px',
        border: '1px solid #ddd',
        marginBottom: '10px',
        cursor: 'pointer',
        backgroundColor: 'rgb(150, 60, 180)', // 호버 시 배경색
        color: 'white',
        fontSize: '16px',
        textAlign: 'center',
        display: 'block',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        width: '100%',
    },
    friendList: {
        flex: 1,
    },
    chatArea: {
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        height: 'calc(100vh - 60px)',
    },
    noFriendsMessage: {
        textAlign: 'center',
        padding: '20px',
        color: '#888',
        fontSize: '16px',
    },
    noMessagesMessage: {
        textAlign: 'center',
        padding: '20px',
        color: '#888',
        fontSize: '16px',
    },
    selectFriendMessage: {
        textAlign: 'center',
        padding: '20px',
        color: '#888',
        fontSize: '16px',
    },
    friendListItems: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    friendListItem: {
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ddd',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    selectedFriendListItem: {
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #aa4dcb',
        marginBottom: '10px',
        cursor: 'pointer',
        backgroundColor: '#aa4dcb',
        color: '#fff',
        transition: 'background-color 0.3s ease',
    },
    inputContainer: {
        marginTop: 'auto',
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #ccc',
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    sendButton: {
        marginLeft: '10px',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#aa4dcb',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default Mypage;
