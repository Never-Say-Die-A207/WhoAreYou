import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
} from 'chart.js';
import happyImage from '../../assets/happy.png';
import sadImage from '../../assets/sad.png';
import angryImage from '../../assets/angry.png';
import disgustedImage from '../../assets/disgusted.png';
import surprisedImage from '../../assets/surprised.png';
import fearImage from '../../assets/fear.png';
import neutralImage from '../../assets/neutral.png';

// Chart.js의 필수 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, BarController);

const EmotionBarChart = ({ emotionCounts }) => {
  const chartRef = useRef(null); // 차트를 위한 캔버스 참조 생성
  const myChartRef = useRef(null); // 차트 인스턴스를 저장할 ref

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d'); // Canvas context 얻기

    const emotionColors = {
      happy: 'yellow',   // "happy" 감정에 대한 막대 색상
      surprised: 'pink', // "surprised" 감정에 대한 막대 색상
      neutral: 'darkblue', // "neutral" 감정에 대한 막대 색상
      disgusted: 'green', // "disgusted" 감정에 대한 막대 색상
      fear: 'purple', // "fear" 감정에 대한 막대 색상
      angry: 'red', // "angry" 감정에 대한 막대 색상
      sad: 'blue', // "sad" 감정에 대한 막대 색상
    };

    // 감정 이미지 매핑
    const emotionImages = {
      happy: happyImage,
      surprised: surprisedImage,
      neutral: neutralImage,
      disgusted: disgustedImage,
      fear: fearImage,
      angry: angryImage,
      sad: sadImage,
    };

    // 차트 생성
    const myChart = new ChartJS(ctx, {
      type: 'bar', // Bar 차트 설정
      data: {
        labels: Object.keys(emotionCounts), // 범주 라벨
        datasets: [
          {
            label: 'Emotion Counts', // 데이터셋 레이블
            data: Object.values(emotionCounts), // 감정 카운트
            backgroundColor: Object.keys(emotionCounts).map(emotion => emotionColors[emotion]), // 막대 색상 설정
            borderColor: Object.keys(emotionCounts).map(emotion => emotionColors[emotion]), // 테두리 색상 설정
            borderWidth: 2, // 테두리 두께 설정
          },
        ],
      },
      options: {
        indexAxis: 'y', // 수평 막대
        scales: {
          x: {
            beginAtZero: true, // x 축이 0에서 시작됨
          },
          y: {
            ticks: {
              callback: (value, index) => { 
                return value; // y축 라벨 설정
              },
              display: true, // y축 라벨 표시
            },
          },
        },
        responsive: true, // 반응형 차트
        maintainAspectRatio: false, // 가로세로 비율 유지하지 않음
      },
      plugins: [{
        id: 'custom-y-labels', // 커스텀 플러그인 ID
        afterDraw: (chart) => { // 차트를 그린 후 호출
          const { ctx, chartArea: { left }, scales: { y } } = chart; // 차트 영역 및 y축 스케일 가져오기
          y.ticks.forEach((value, index) => { // 각 y축 레이블에 대해
            const emotionName = chart.data.labels[index]; // 현재 감정 이름
            const image = new Image(); // 이미지 객체 생성
            image.src = emotionImages[emotionName]; // 감정 이미지를 가져옵니다.
            const xPos = left - 25; // 이미지의 x 위치 (왼쪽 여백)
            const yPos = y.getPixelForTick(index) - 15; // 이미지의 y 위치
            image.onload = () => ctx.drawImage(image, xPos, yPos, 20, 20); // 이미지를 그립니다.
          });
        }
      }]
    });

    // 이전 차트를 정리하고 새로운 차트를 설정
    if (myChartRef.current) {
      myChartRef.current.destroy(); // 이전 차트를 제거합니다.
    }
    myChartRef.current = myChart; // 새로운 차트 인스턴스를 저장합니다.

    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy(); // 컴포넌트가 언마운트될 때 차트를 제거
      }
    };
  }, [emotionCounts]); // 감정 카운트 변경 시 업데이트

  return (
    <div style={{ width: '100%', height: '300px' }}> 
      <canvas ref={chartRef} /> {/* 차트를 렌더링할 캔버스 */}
    </div>
  );
};

export default EmotionBarChart; // EmotionBarChart 컴포넌트를 기본 내보내기로 설정합니다.