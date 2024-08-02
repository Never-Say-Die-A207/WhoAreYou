import React, { useState, useEffect } from 'react';

const TimerComponent = ({ startTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTime) / 1000);
      const remainingTime = 300 - elapsed;

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        onTimeUp();
      } else {
        setTimeLeft(remainingTime);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime, onTimeUp]);

  return (
    <div>
      <h2>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</h2>
    </div>
  );
};

export default TimerComponent;
