import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import * as THREE from 'three';
import './ThreeScene.css';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

extend({ Line2, LineMaterial, LineGeometry });

const ShapeComponent = React.memo(({ landmarks, indices, color }) => {
  const ref = useRef();

  useEffect(() => {
    if (landmarks) {
      const shape = new THREE.Shape();

      indices.forEach((index, i) => {
        const { x, y } = landmarks[index];
        if (i === 0) {
          shape.moveTo((x * 4 - 2), -(y * 2.2 -1.1));
        } else {
          shape.lineTo((x * 4 - 2), -(y * 2.2 -1.1));
        }
      });

      shape.closePath();

      const geometry = new THREE.ShapeGeometry(shape);

      if (ref.current.geometry) ref.current.geometry.dispose();
      ref.current.geometry = geometry;
      ref.current.position.z = 0.1; // Z축 위치를 약간 앞으로 이동
    }
  }, [landmarks, indices]);

  return (
    <mesh ref={ref}>
      <meshBasicMaterial attach="material" color={color} side={THREE.DoubleSide} />
    </mesh>
  );
});

const LineComponent = React.memo(({ landmarks, indices, color, lineWidth }) => {
  const ref = useRef();

  useEffect(() => {
    if (landmarks) {
      const points = indices.map(index => {
        const { x, y } = landmarks[index];
        return new THREE.Vector3((x * 4 - 2), -(y * 2.2-1.1), 0.1); // Z축 위치를 약간 앞으로 이동
      });

      const positions = new Float32Array(points.length * 3);
      points.forEach((point, i) => {
        positions.set([point.x, point.y, point.z], i * 3);
      });

      const geometry = new LineGeometry();
      geometry.setPositions(positions);

      ref.current.geometry = geometry;
    }
  }, [landmarks, indices]);

  return (
    <line2 ref={ref}>
      <lineMaterial attach="material" color={color} linewidth={lineWidth} />
    </line2>
  );
});

const VideoTexture = ({ videoRef }) => {
  const { scene } = useThree();
  const texture = useMemo(() => new THREE.VideoTexture(videoRef.current), [videoRef]);

  useEffect(() => {
    if (videoRef.current) {

      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;
      texture.colorSpace = THREE.SRGBColorSpace;
      const geometry = new THREE.PlaneGeometry(4, 2.25); // 크기를 조정합니다
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 0;
      scene.add(mesh);

      return () => {
        scene.remove(mesh);
        texture.dispose();
      };
    }
  }, [videoRef, scene, texture]);

  return null;
};

const JokerLocal = ({ landmarks, videoElement }) => {
  const faceOutlineIndices1 = [10, 338, 297, 332, 284, 251, 389, 356, 454, 446, 467, 260, 259, 257, 258, 286, 414, 464, 351, 196, 193, 55, 107, 109, 10];
  const faceOutlineIndices2 = [10, 109, 67, 103, 54, 21, 162, 127, 234, 111, 226, 247, 30, 29, 27, 28, 56, 190, 243, 188, 197, 10];
  const faceOutlineIndices3 = [127, 156, 113, 130, 25, 110, 24, 23, 22, 26, 245, 193, 248, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127];
  const faceOutlineIndices4 = [356, 383, 342, 359, 255, 339, 254, 253, 252, 256, 464, 417, 168, 174, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361, 323, 454, 356];
  const GreenEye = [29, 27, 28, 56, 69, 29];
  const GreenEye2 = [25, 110, 24, 23, 22, 26, 36, 25];
  const GreenEye3 = [259, 257, 258, 286, 295, 259];
  const GreenEye4 = [339, 254, 253, 252, 256, 348, 339];
  const faceline = [217, 100, 118, 111];
  const faceline2 = [198, 209, 36, 50, 123];
  const faceline3 = [437, 329, 347, 340];
  const faceline4 = [420, 429, 266, 280, 352];
  const nose1 = [94, 1]
  const nose2 = [1, 45]
  const nose3 = [1, 275]
  const head = [151, 107, 168, 336, 151]
  // const faceOutlineIndices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
  // const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362];
  // const leftEyeIndices = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155, 133];
  // const noseIndices = [168, 122, 174, 198, 209, 49, 64, 98, 97, 2, 326, 327, 294, 279, 429, 420, 399, 351, 168];
  const topLipIndices = [187, 165, 391, 411, 432, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 76, 61, 57, 187];
  const bottomLipIndices = [187, 214, 204, 194, 201, 200, 421, 418, 424, 422, 432, 411, 427, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 61, 216, 187];
  const leftEyebrowIndices = [336, 296, 334, 293, 300, 276, 283, 282, 295, 285, 336];
  const rightEyebrowIndices = [107, 66, 105, 63, 70, 46, 53, 52, 65, 55, 107];



    return (
    <div className="canvas-container" style={{position:'absolute', top:'0', left:'0', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 25.4 }}
        style={{
          // position: 'absolute',
          // top: '0',
          // left: '0',
          transform: 'scaleX(-1)',
          width: '100%',
          height: '100%',
        //   zIndex: 10,
        // 일반 동영상 같은 경우는 index값을 높여야함
          zIndex: 100,
        }}
        
      >
        <ambientLight intensity={0} />
        <pointLight position={[10, 10, 10]}/>
        {videoElement?.current && (
          <VideoTexture videoRef={videoElement} />
        )}
        {landmarks && (
          <>
            <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices1} color="white" />
            <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices2} color="white" />
            <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices3} color="white" />
            <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices4} color="white" />
            {/* <ShapeComponent landmarks={landmarks} indices={leftEyebrowIndices} color="#dc143c" />
            <ShapeComponent landmarks={landmarks} indices={rightEyebrowIndices} color="#dc143c" /> */}
            <ShapeComponent landmarks={landmarks} indices={GreenEye} color="green" />
            <ShapeComponent landmarks={landmarks} indices={GreenEye2} color="green" />
            <ShapeComponent landmarks={landmarks} indices={GreenEye3} color="green" />
            <ShapeComponent landmarks={landmarks} indices={GreenEye4} color="green" />
            <ShapeComponent landmarks={landmarks} indices={topLipIndices} color="red" />
            <ShapeComponent landmarks={landmarks} indices={bottomLipIndices} color="red" />
           

          </>

        )}
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.1} luminanceThreshold={0.8} luminanceSmoothing={0.4} height={40} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default JokerLocal;
