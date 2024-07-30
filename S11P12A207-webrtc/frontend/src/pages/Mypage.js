import React, { useState, useEffect } from 'react';
import FriendList from './FriendList';
import MessageList from './MessageList';

const Mypage = () => {
    const [messages, setMessages] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchData = () => {
            const dummyFriends = [
                { id: 1, name: '홍길동' },
                { id: 2, name: '김철수' }
            ];

            const dummyMessages = [
                { id: 1, sender: '홍길동', text: '안녕하세요!', time: new Date().toLocaleTimeString() },
                { id: 2, sender: '나', text: '안녕하세요! 잘 지내세요?', time: new Date().toLocaleTimeString() }
            ];

            setFriends(dummyFriends);
            setMessages(dummyMessages);
        };

        fetchData();
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, sender: '나', text: newMessage, time: new Date().toLocaleTimeString() }]);
            setNewMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.friendList}>
                {friends.length === 0 ? (
                    <div style={styles.noFriendsMessage}>
                        친구가 없습니다. 친구를 추가하세요!
                    </div>
                ) : (
                    <FriendList friends={friends} onSelectFriend={setSelectedFriend} />
                )}
            </div>
            <div style={styles.chatArea}>
                {selectedFriend ? (
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
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        backgroundColor: '#e5e5e5',
    },
    friendList: {
        width: '25%',
        borderRight: '1px solid #ccc',
        padding: '10px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
    },
    chatArea: {
        width: '75%',
        padding: '10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
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
    sendButtonHover: {
        backgroundColor: '#8a3fb8',
    }
};

export default Mypage;
