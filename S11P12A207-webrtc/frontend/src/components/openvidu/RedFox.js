import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import * as THREE from 'three';
import './ThreeScene.css';

extend({ Line2, LineMaterial, LineGeometry });

const ShapeComponent = ({ landmarks, indices, color }) => {
  const ref = useRef();

  useFrame(() => {
    if (landmarks && ref.current) {
      const shape = new THREE.Shape();

      indices.forEach((index, i) => {
        const { x, y } = landmarks[index];
        if (i === 0) {
          shape.moveTo((x * 1.2 - 0.6), -(y * 0.95 - 0.465));
        } else {
          shape.lineTo((x * 1.2 - 0.6), -(y * 0.95 - 0.465));
        }
      });

      shape.closePath();

      const geometry = new THREE.ShapeGeometry(shape);

      if (ref.current.geometry) ref.current.geometry.dispose();
      ref.current.geometry = geometry;
    }
  });

  return (
    <mesh ref={ref}>
      <meshBasicMaterial attach="material" color={color} side={THREE.DoubleSide} />
    </mesh>
  );
};

const LineComponent = ({ landmarks, indices, color, lineWidth }) => {
  const ref = useRef();

  useFrame(() => {
    if (landmarks && ref.current) {
      const points = indices.map(index => {
        const { x, y } = landmarks[index];
        return new THREE.Vector3((x * 1.2 - 0.6), -(y * 0.95 - 0.46), 0);
      });

      const positions = new Float32Array(points.length * 3);
      points.forEach((point, i) => {
        positions.set([point.x, point.y, point.z], i * 3);
      });

      const geometry = new LineGeometry();
      geometry.setPositions(positions);

      ref.current.geometry = geometry;
    }
  });

  return (
    <line2 ref={ref}>
      <lineMaterial attach="material" color={color} linewidth={lineWidth} />
    </line2>
  );
};

const RedFox = ({ landmarks }) => {
  const faceOutlineIndices1 = [10, 338, 297, 332, 284, 251, 389, 356, 454, 446, 467, 260, 259, 257, 258, 286, 414, 464, 351, 196, 193, 55, 107, 109, 10];
  const faceOutlineIndices2 = [10, 109, 67, 103, 54, 21, 162, 127, 234, 111, 226, 247, 30, 29, 27, 28, 56, 190, 243, 188, 197, 10];
  const faceOutlineIndices3 = [127, 156, 113, 130, 25, 110, 24, 23, 22, 26, 245, 193, 248, 4, 94, 167, 94, 167, 92, 216, 177, 93, 234, 127];
  const faceOutlineIndices4 = [356, 383, 342, 359, 255, 339, 254, 253, 252, 256, 464, 417, 168, 174, 134, 94, 393, 322, 436, 401, 323, 454, 356];
  const RedEye1 = [174, 245, 189, 221, 222, 223, 70, 124, 31, 228, 230, 121, 114, 174, 188, 245, 244, 26, 22, 23, 24, 110, 25, 130, 247, 30, 29, 27, 28, 56, 190, 243, 174];
  const RedEye2 = [399, 465, 413, 441, 442, 443, 300, 353, 261, 448, 450, 350, 343, 399, 412, 465, 464, 256, 252, 253, 254, 339, 255, 359, 467, 260, 259, 257, 258, 286, 414, 463, 399];
  const faceline = [217, 100, 118, 111];
  const faceline2 = [198, 209, 36, 50, 123];
  const faceline3 = [437, 329, 347, 340];
  const faceline4 = [420, 429, 266, 280, 352];
  const nose1 = [94, 1];
  const nose2 = [1, 45];
  const nose3 = [1, 275];
  const head = [151, 107, 168, 336, 151];

  return (
    <div className="canvas-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 20 }}
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translate(-50%, -67%) scaleX(-1)',
          width: '640px',
          height: '480px',
          zIndex: 10,
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {landmarks && (
          <>
            <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices1} color="white" />
            <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices2} color="white" />
            <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices3} color="white" />
            <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices4} color="white" />
            <ShapeComponent landmarks={landmarks} indices={RedEye1} color="red" />
            <ShapeComponent landmarks={landmarks} indices={RedEye2} color="red" />
            <ShapeComponent landmarks={landmarks} indices={head} color="red" />
            <LineComponent landmarks={landmarks} indices={faceline} color="red" lineWidth={3.5} />
            <LineComponent landmarks={landmarks} indices={faceline2} color="red" lineWidth={3.5} />
            <LineComponent landmarks={landmarks} indices={faceline3} color="red" lineWidth={3.5} />
            <LineComponent landmarks={landmarks} indices={faceline4} color="red" lineWidth={3.5} />
            <LineComponent landmarks={landmarks} indices={nose1} color="black" lineWidth={3} />
            <LineComponent landmarks={landmarks} indices={nose2} color="black" lineWidth={3} />
            <LineComponent landmarks={landmarks} indices={nose3} color="black" lineWidth={3} />
          </>
        )}
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.4} luminanceThreshold={0.5} luminanceSmoothing={0.9} height={100} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default RedFox;
