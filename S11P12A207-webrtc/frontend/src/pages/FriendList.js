import React from 'react';

const FriendList = ({ friends, onSelectFriend }) => {
    return (
        <div>
            <h2>친구 목록</h2>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {friends.map(friend => (
                    <li
                        key={friend.id}
                        style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #ddd',
                            backgroundColor: '#f0f0f0',
                            transition: 'background-color 0.3s ease',
                        }}
                        onClick={() => onSelectFriend(friend)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0b9e3'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    >
                        {friend.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
