import React, { useRef, useEffect } from 'react';

const MessageList = ({ messages, userId }) => {
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={styles.messageList}>
            {messages.map((message) => (
                <div
                    key={message.id}
                    style={{
                        ...styles.message,
                        alignSelf: message.senderId === userId ? 'flex-end' : 'flex-start',
                        backgroundColor: message.senderId === userId ? '#dcf8c6' : '#fff',
                    }}
                >
                    <div style={styles.text}>{message.text}</div>
                    <div style={styles.time}>{message.time}</div>
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
    message: {
        margin: '10px 0',
        padding: '10px',
        borderRadius: '10px',
        maxWidth: '60%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s ease',
    },
    text: {
        marginBottom: '5px',
    },
    time: {
        fontSize: '12px',
        color: '#aaa',
        textAlign: 'right',
    },
};

export default MessageList;
