/* eslint-disable no-restricted-globals */
import * as faceapi from 'face-api.js';

// Web Worker 환경에서 환경 설정 명시
faceapi.env.monkeyPatch({
  fetch: self.fetch.bind(self),
  Response: self.Response,
  readFile: async (filePath) => {
    const response = await fetch(filePath);
    return await response.arrayBuffer();
  }
});

const loadModels = async () => {
  const MODEL_URL = '../../public/models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  postMessage({ type: 'modelsLoaded' });
  console.log('Models loaded successfully in worker');
};

self.onmessage = async (event) => {
  if (event.data.type === 'loadModels') {
    await loadModels();
  } else if (event.data.type === 'detectFace') {
    const { imageData } = event.data;
    const detections = await faceapi.detectAllFaces(
      imageData,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5,
      })
    ).withFaceLandmarks().withFaceExpressions();

    console.log('Detections in worker:', detections);
    postMessage({ type: 'detections', detections });
  }
};
/* eslint-enable no-restricted-globals */
