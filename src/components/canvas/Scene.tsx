import { Physics, usePlane } from '@react-three/cannon';
import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { Mesh } from 'three';

const Effects = dynamic(() => import('@/templates/providers/effectsProvider'), { ssr: false });

const Floor = () => {
  const [floor] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
    type: 'Static',
  }), useRef<Mesh>())

  return <mesh ref={floor}>
    <planeGeometry args={[100, 100]} />
    <meshStandardMaterial transparent opacity={0} />
  </mesh>;
}

export default function Scene({ children, ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped

  return (
    <>
      <Canvas {...props}>
        <XR referenceSpace="local-floor">
          <directionalLight intensity={0.75} />
          <ambientLight intensity={0.75} />
          <Effects />
          <Physics gravity={[0, -10, 0]}>
            {children}

            <Floor />
          </Physics>
          <Preload all />
        </XR>
        {/* <OrbitControls /> */}
        {/* <CameraControls /> */}
      </Canvas>
    </>
  )
}
