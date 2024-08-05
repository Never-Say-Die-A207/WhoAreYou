FROM node:14
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install react-responsive
RUN npm install --save @types/react-responsive
RUN npm install bootstrap
RUN npm install three @react-three/fiber @react-three/postprocessing @mediapipe/face_mesh @mediapipe/camera_utils react-dom
RUN npm i face-api.js
RUN npm i face-api.js canvas @tensorflow/tfjs-node
RUN npm install jwt-decode
RUN npm install react-modal
RUN npm install react-spinners
COPY . .
EXPOSE 3000
CMD ["npm", "start"]