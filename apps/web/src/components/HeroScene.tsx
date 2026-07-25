// 'use client';

// import { Canvas, useFrame } from '@react-three/fiber';
// import { Float, OrbitControls } from '@react-three/drei';
// import { useRef } from 'react';
// import * as THREE from 'three';

// function RotatingBox() {
//   const mesh = useRef<THREE.Mesh>(null!);

//   useFrame((_, delta) => {
//     mesh.current.rotation.x += delta * 0.3;
//     mesh.current.rotation.y += delta * 0.5;
//   });

//   return (
//     <Float speed={2} rotationIntensity={2} floatIntensity={2}>
//       <mesh ref={mesh}>
//         <icosahedronGeometry args={[1.2, 1]} />
//         <meshStandardMaterial
//           color="#7c3aed"
//           wireframe
//         />
//       </mesh>
//     </Float>
//   );
// }

// export default function HeroScene() {
//   return (
//     <Canvas camera={{ position: [0, 0, 5] }}>
//       <ambientLight intensity={2} />

//       <directionalLight
//         position={[3, 3, 3]}
//         intensity={2}
//       />

//       <RotatingBox />

//       <OrbitControls
//         enableZoom={false}
//         enablePan={false}
//         autoRotate
//         autoRotateSpeed={1}
//       />
//     </Canvas>
//   );
// }