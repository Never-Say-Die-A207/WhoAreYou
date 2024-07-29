import React from 'react';

const MessageList = ({ messages }) => {
    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', backgroundColor: '#f9f9f9', maxHeight: '60vh', overflowY: 'auto' }}>
            {messages.map((message) => (
                <div key={message.id} style={{ margin: '10px 0', textAlign: message.sender === '유저' ? 'right' : 'left' }}>
                    <strong>{message.sender}</strong>: {message.text}
                </div>
            ))}
        </div>
    );
};

export default MessageList;
