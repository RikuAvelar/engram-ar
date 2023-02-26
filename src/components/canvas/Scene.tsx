import { Physics, usePlane } from '@react-three/cannon';
import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { Mesh } from 'three';

import { ARCanvas, ARMarker } from '@artcom/react-three-arjs';

const Effects = dynamic(() => import('@/templates/providers/effectsProvider'), { ssr: false });
// const ARCanvas = dynamic(async () => (await import('@artcom/react-three-arjs')).ARCanvas, { ssr: false })

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

  const CanvasComponent = typeof window === 'undefined' ? Canvas : ARCanvas;

  return (
    <>
      <CanvasComponent camera={{ position: [0, 0, 0] }} dpr={window.devicePixelRatio}>
        <directionalLight intensity={0.75} />
        <ambientLight intensity={0.75} />
        <Effects />
        <Physics gravity={[0, -10, 0]}>
          <ARMarker type="pattern" patternUrl="markers/hiro.patt">
            {children}

            <Floor />
          </ARMarker>
        </Physics>
        <Preload all />
        {/* <OrbitControls /> */}
        {/* <CameraControls /> */}
      </CanvasComponent>
    </>
  )
}
