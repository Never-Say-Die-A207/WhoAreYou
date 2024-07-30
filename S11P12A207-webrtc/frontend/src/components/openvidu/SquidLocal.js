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

const SquidLocal = ({ landmarks, videoElement }) => {
  const faceOutlineIndices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
  const triangle = [9, 50, 280, 9]
  const line = [205, 425]
   
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
          <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices} color="black" />
            <LineComponent landmarks={landmarks} indices={triangle} color="white" lineWidth={6} />
            <LineComponent landmarks={landmarks} indices={line} color="white" lineWidth={0.5} />
    

          </>

        )}
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.1} luminanceThreshold={0.8} luminanceSmoothing={0.4} height={40} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default SquidLocal;
