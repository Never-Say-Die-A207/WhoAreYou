import React from 'react';

const MessageList = ({ messages }) => {
    return (
        <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '10px', 
            padding: '20px', 
            backgroundColor: '#f9f9f9', 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            overflowY: 'auto'
        }}>
            {messages.map((message) => (
                <div key={message.id} style={{ 
                    margin: '10px 0', 
                    textAlign: message.sender === '나' ? 'right' : 'left',
                    transition: 'background-color 0.3s ease',
                }}>
                    <strong>{message.sender}</strong>: {message.text}
                </div>
            ))}
        </div>
    );
};

export default MessageList;
