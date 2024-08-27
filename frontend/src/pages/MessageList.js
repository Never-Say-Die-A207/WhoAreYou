import React, { useRef, useEffect } from 'react';

const MessageList = ({ messages, userId }) => {
    const endOfMessagesRef = useRef(null);
    const nickname = localStorage.getItem('nickname');

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={styles.messageList}>
            {messages.map((message, index) => (
                <div
                    key={index}
                    style={{
                        ...styles.messageWrapper,
                        alignSelf: message.sender === nickname ? 'flex-end' : 'flex-start',
                    }}
                >
                    {message.sender !== nickname && <div style={styles.sender}>{message.sender}</div>}
                    <div
                        style={{
                            ...styles.message,
                            backgroundColor: message.sender === nickname ? '#dcf8c6' : '#fff',
                            alignSelf: message.sender === nickname ? 'flex-end' : 'flex-start',
                        }}
                    >
                        <div style={styles.text}>{message.message}</div>
                        <div
                            style={{
                                ...styles.time,
                                textAlign: message.sender === nickname ? 'right' : 'left',
                            }}
                        >
                            {message.time}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

const styles = {
    messageList: {
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
    messageWrapper: {
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '60%',
    },
    message: {
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s ease',
    },
    sender: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '5px',
        textAlign: 'left',
        color: '#b0b0b0',
    },
    text: {
        marginBottom: '5px',
    },
    time: {
        fontSize: '12px',
        color: '#aaa',
    },
};

export default MessageList;
