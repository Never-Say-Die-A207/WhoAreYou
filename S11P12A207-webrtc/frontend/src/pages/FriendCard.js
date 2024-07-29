import React from 'react';

const FriendCard = ({ friend }) => {
    const { id, nickname, mask } = friend;

    const handleChat = () => {
        console.log(`Start chatting with ${nickname}`);
        console.log(mask);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '10px', width: '200px', textAlign: 'center' }}>
            <img src={require(`../assets/${mask}.png`)} alt={mask} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{nickname}</h3>
            <button onClick={handleChat} style={{ padding: '8px', backgroundColor: '#aa4dcb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                채팅하기
            </button>
        </div>
    );
};

export default FriendCard;
