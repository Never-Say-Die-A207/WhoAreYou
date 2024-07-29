import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendCard from './FriendCard';
import MessageList from './MessageList';
import api from '../api/api';

const Mypage = () => {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const navigate = useNavigate();

    const userData = {
        name: '유저',
        email: 'email'
    };

    const friends = [
        {
            id: 1,
            nickname: '황태건',
        },
        {
            id: 2,
            nickname: '김태건',
        }
    ];

    useEffect(() => {
        if (selectedFriend) {
            const fetchMessages = async () => {
                try {
                    // const response = await api.get(`/messages/${selectedFriend.id}`);
                    // setMessages(response.data);
                    setMessages([
                        { id: 1, text: '안녕하세요!', sender: '김태건' },
                        { id: 2, text: '안녕하세요, 반가워요!', sender: '유저' }
                    ]);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
            fetchMessages();
        }
    }, [selectedFriend]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                text: newMessage,
                sender: '유저' // Assuming the current user is '유저'
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '20px' }}>
                <h1>마이페이지</h1>
                <h2>{userData.name}</h2>
                <p>{userData.email}</p>
                {friends.length > 0 ? (
                    <div>
                        {friends.map((friend) => (
                            <div
                                key={friend.id}
                                onClick={() => setSelectedFriend(friend)}
                                style={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedFriend?.id === friend.id ? '#aa4dcb' : 'transparent',
                                    color: selectedFriend?.id === friend.id ? 'white' : 'black',
                                    borderRadius: '5px',
                                    margin: '10px 0'
                                }}
                            >
                                {friend.nickname}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', color: '#666' }}>
                        친구가 없어요! 새로운 친구를 사귀어 보세요.
                    </div>
                )}
            </div>
            <div style={{ flex: 2, padding: '20px' }}>
                {selectedFriend ? (
                    <>
                        <h2>{selectedFriend.nickname}와의 대화</h2>
                        <MessageList messages={messages} />
                        <div style={{ display: 'flex', marginTop: '20px' }}>
                            <input
                                type='text'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    marginRight: '10px'
                                }}
                                placeholder='메시지를 입력하세요...'
                            />
                            <button
                                onClick={handleSendMessage}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#aa4dcb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                전송하기
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', color: '#666' }}>
                        대화할 친구를 선택해 주세요.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mypage;
