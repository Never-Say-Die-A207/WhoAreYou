import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
} from 'chart.js';

// Chart.js의 필수 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, BarController);

const EmotionBarChart = ({ emotionCounts }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      const emotionColors = {
        happy: 'yellow',
        surprised: 'pink',
        neutral: 'darkblue',
        disgusted: 'green',
        fear: 'purple',
        angry: 'red',
        sad: 'blue',
      };
      
      // 차트 생성
      const myChart = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(emotionCounts), // 감정 키
          datasets: [
            {
              label: 'Emotion Counts',
              data: Object.values(emotionCounts), // 감정 카운트
              backgroundColor: Object.keys(emotionCounts).map(emotion => emotionColors[emotion]),
              borderColor: 'black',
              borderWidth: 2,
            },
          ],
        },
        options: {
          indexAxis: 'y', // 막대를 수평으로 그리도록 설정
          scales: {
            x: {
              beginAtZero: true,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      // 컴포넌트 언마운트 시 차트 제거
      return () => {
        myChart.destroy();
      };
    }
  }, [emotionCounts]); // 감정 카운트가 변경될 때마다 차트 업데이트

  return (
    <div style={{ width: '600px', height: '200px' }}> {/* 원하는 크기로 설정 */}
      <canvas 
        ref={chartRef} // 캔버스 레퍼런스 설정
      />
    </div>
  );
};

export default EmotionBarChart;