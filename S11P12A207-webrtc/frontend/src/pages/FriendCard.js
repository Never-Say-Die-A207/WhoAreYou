import React from 'react';

const FriendCard = ({ friend, onClick, isSelected }) => {
    const { nickname } = friend;

    return (
        <div
            onClick={onClick}
            style={{
                border: isSelected ? '2px solid #aa4dcb' : '1px solid #ccc',
                padding: '20px',
                margin: '10px',
                borderRadius: '10px',
                width: '200px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#f3e5f5' : 'white'
            }}
        >
            <h3>{nickname}</h3>
        </div>
    );
};

export default FriendCard;
