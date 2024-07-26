import React from 'react';

const FriendCard = ({ friend }) => {
    const { id, name, email, mask } = friend;

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px' }}>
            <h3>{name}</h3>
            <p>{email}</p>
            <p>{mask}</p>
        </div>
    );
};

export default FriendCard;
