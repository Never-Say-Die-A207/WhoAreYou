import React, { useState, useEffect } from 'react';
import FriendList from './FriendList';
import MessageList from './MessageList';

const Mypage = () => {
    const [messages, setMessages] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriendId, setSelectedFriendId] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchData = () => {
            const dummyFriends = [
                { id: 1, name: '홍길동' },
                { id: 2, name: '김철수' },
                { id: 3, name: '이영희' },
                { id: 4, name: '박지민' },
                { id: 5, name: '최민호' },
            ];

            const dummyMessages = [
                { id: 1, sender: '홍길동', text: '안녕하세요!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: 2, sender: '나', text: '안녕하세요! 잘 지내세요?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ];

            setFriends(dummyFriends);
            setMessages(dummyMessages);
        };

        fetchData();
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, sender: '나', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            setNewMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFriendClick = (friendId) => {
        setSelectedFriendId(friendId);
    };

    const isFriendSelected = (friendId) => selectedFriendId === friendId;

    return (
        <div style={styles.container}>
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
                                onClick={() => handleFriendClick(friend.id)}
                            >
                                {friend.name}
                            </li>
                        ))}
                    </ul>
                )}
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
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: 'calc(100vh - 60px)',
    },
    friendList: {
        width: '20%',
        borderRight: '1px solid #ccc',
        padding: '10px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        height: 'calc(100vh - 60px)',
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
