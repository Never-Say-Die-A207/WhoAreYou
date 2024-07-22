import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import * as THREE from 'three';
// import './ThreeScene.css';

extend({ Line2, LineMaterial, LineGeometry });

const ShapeComponent = ({ landmarks, indices, color }) => {
    const ref = useRef();

    useFrame(() => {
        if (landmarks && ref.current) {
            const shape = new THREE.Shape();

            indices.forEach((index, i) => {
                const { x, y } = landmarks[index];
                if (i === 0) {
                    shape.moveTo((x * 1.2 - 0.6), -(y * 0.93 - 0.465));
                } else {
                    shape.lineTo((x * 1.2 - 0.6), -(y * 0.93 - 0.465));
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
                return new THREE.Vector3((x * 1.2 - 0.6), -(y * 0.93 - 0.46), 0);
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
            <lineMaterial attach="material" color={color} linewidth={lineWidth} /> {/* Use the lineWidth prop */}
        </line2>
    );
};

const SpiderMan = ({ landmarks }) => {
    //   const faceOutlineIndices1 = [10, 338, 297, 332, 284, 251, 389, 356, 454, 446, 467, 260, 259, 257, 258, 286, 414, 464, 351, 196, 193, 55, 107, 109, 10];
    //   const faceOutlineIndices2 = [10, 109, 67, 103, 54, 21, 162, 127, 234, 111, 226, 247, 30, 29, 27, 28, 56, 190, 243, 188, 197, 10];
    //   const faceOutlineIndices3 = [127, 156, 113, 130, 25, 110, 24, 23, 22, 26, 245, 193, 248, 4, 94, 167, 94, 167, 92, 216, 177, 93, 234, 127];
    //   const faceOutlineIndices4 = [356, 383, 342, 359, 255, 339, 254, 253, 252, 256, 464, 417, 168, 174, 134, 94, 393, 322, 436, 401, 323, 454, 356];
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
    //   const faceline = [217, 100, 118, 111];
    //   const faceline2 = [198, 209, 36, 50, 123];
    //   const faceline3 = [437, 329, 347, 340];
    //   const faceline4 = [420, 429, 266, 280, 352];
    //   const nose1 = [94, 1]
    //   const nose2 = [1, 45]
    //   const nose3 = [1, 275]
    //   const head = [151, 107, 168, 336, 151]
    const faceOutlineIndices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
    // const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362];
    // const leftEyeIndices = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155, 133];
    // const noseIndices = [168, 122, 174, 198, 209, 49, 64, 98, 97, 2, 326, 327, 294, 279, 429, 420, 399, 351, 168];
    // const topLipIndices = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 76, 61];
    // const bottomLipIndices = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 61];
    // const leftEyebrowIndices = [336, 296, 334, 293, 300, 276, 283, 282, 295, 285, 336];
    // const rightEyebrowIndices = [107, 66, 105, 63, 70, 46, 53, 52, 65, 55, 107];

    return (
        <div className="canvas-container">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 10 }}
                style={{
                    position: 'absolute',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    zIndex: 9,
                    width: 640,
                    height: 480,
                    transform: 'scaleX(-1)',
                }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {landmarks && (
                    <>
                        <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices} color="#B11313" />
                        <ShapeComponent landmarks={landmarks} indices={whiteEye1} color="white" />
                        <ShapeComponent landmarks={landmarks} indices={whiteEye2} color="white" />
                        <ShapeComponent landmarks={landmarks} indices={BlackEye1} color="black" />
                        <ShapeComponent landmarks={landmarks} indices={BlackEye2} color="black" />
                        <LineComponent landmarks={landmarks} indices={faceline} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline2} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline3} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline4} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline5} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline6} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline7} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline8} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline9} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline10} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline11} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline12} color="black" lineWidth={1.2} />
                        <LineComponent landmarks={landmarks} indices={faceline13} color="black" lineWidth={1.2} />
       

                        {/* <ShapeComponent landmarks={landmarks} indices={faceOutlineIndices1} color="white" />
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
            <LineComponent landmarks={landmarks} indices={nose3} color="black" lineWidth={3} />  */}
                    </>
                )}
                <EffectComposer multisampling={0}>
                    <Bloom intensity={0.4} luminanceThreshold={0.5} luminanceSmoothing={0.9} height={100} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default SpiderMan;
