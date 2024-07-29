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

// const VideoTexture = ({ videoRef }) => {
//   const { scene } = useThree();
//   const texture = useMemo(() => new THREE.VideoTexture(videoRef.current), [videoRef]);

//   useEffect(() => {
//     if (videoRef.current) {

//       texture.minFilter = THREE.LinearFilter;
//       texture.magFilter = THREE.LinearFilter;
//       texture.format = THREE.RGBFormat;
//       texture.colorSpace = THREE.SRGBColorSpace;
//       const geometry = new THREE.PlaneGeometry(4, 2.25); // 크기를 조정합니다
//       const material = new THREE.MeshBasicMaterial({ map: texture });
//       const mesh = new THREE.Mesh(geometry, material);
//       mesh.position.y = 0;
//       scene.add(mesh);

//       return () => {
//         scene.remove(mesh);
//         texture.dispose();
//       };
//     }
//   }, [videoRef, scene, texture]);

//   return null;
// };

const SpiderManBlackLocal = ({ landmarks }) => {
  const BlackEye1 = [122, 193, 55, 65, 52, 68, 156, 35, 111, 117, 118, 119, 47, 174, 196, 122, 245, 244, 243, 26, 22, 23, 24, 110, 25, 130, 247, 30, 29, 27, 28, 56, 190, 243, 244, 245, 122];
  const BlackEye2 = [351, 417, 285, 295, 282, 298, 383, 265, 340, 346, 347, 348, 277, 399, 419, 351, 465, 464, 463, 256, 252, 253, 254, 339, 255, 359, 467, 260, 259, 257, 258, 286, 414, 463, 399];
  const whiteEye1 = [244, 189, 221, 222, 223, 224, 225, 124, 35, 31, 228, 229, 230, 231, 232, 233, 244]
  const whiteEye2 = [464, 413, 441, 442, 443, 444, 445, 353, 265, 261, 448, 449, 450, 451, 452, 453, 464]
  const faceline = [229, 101, 218, 438, 330, 449]
  const faceline2 = [137, 207, 191, 415, 427, 366 ]
  const faceline3 = [140, 3, 248, 369]
  const faceline4 = [170, 174, 232]
  const faceline5 = [230, 138]
  const faceline6 = [395, 399, 452]
  const faceline7 = [450, 367]
  const faceline8 = [110, 137]
  const faceline9 = [339, 366]
  const faceline10 = [109, 193, 417, 338]
  const faceline11 = [332, 282]
  const faceline12 = [103, 52]
  const faceline13 = [52, 108, 337, 282]
  const faceOutlineIndices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];

 
    return (
    <div className="canvas-container" style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 25.4 }}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
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
        {/* <VideoTexture videoRef={videoElement} /> */}
        {landmarks && (
          <>
                      <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices} color="#292929" />
                        <ShapeComponent landmarks={landmarks} indices={whiteEye1} color="white" />
                        <ShapeComponent landmarks={landmarks} indices={whiteEye2} color="white" />
                        <LineComponent landmarks={landmarks} indices={faceline} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline2} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline3} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline4} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline5} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline6} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline7} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline8} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline9} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline10} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline11} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline12} color="#9a9a9a" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline13} color="#9a9a9a" lineWidth={1.2} />
                        <ShapeComponent landmarks={landmarks} indices={BlackEye1} color="black" />
                        <ShapeComponent landmarks={landmarks} indices={BlackEye2} color="black" />

          </>

        )}
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.2} luminanceThreshold={0.8} luminanceSmoothing={0.4} height={80} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default SpiderManBlackLocal;
