import { Physics, usePlane } from '@react-three/cannon';
import { Preload } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Mesh } from 'three';

import { ARCanvas, ARMarker } from '@artcom/react-three-arjs';
import EngramCannonWrapper from './Engram';

const Effects = dynamic(() => import('@/templates/providers/effectsProvider'), { ssr: false });
// const ARCanvas = dynamic(async () => (await import('@artcom/react-three-arjs')).ARCanvas, { ssr: false })

const Floor = () => {
  const [floor] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static',
  }), useRef<Mesh>())

  return <mesh ref={floor}>
    <planeGeometry args={[500, 500]} />
    <meshStandardMaterial transparent opacity={0} />
  </mesh>;
}

export default function Scene({ children, ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  const [hasSpawned, setSpawn] = useState(false);

  return (
    <>
      <ARCanvas camera={{ position: [0, 0, 0] }} dpr={window.devicePixelRatio} onCreated={({ gl }) => {
        gl.setSize(window.innerWidth, window.innerHeight)
      }}>
        {/* <directionalLight intensity={0.75} /> */}
        <ambientLight intensity={0.75} />
        <Effects />
        <ARMarker type="pattern" patternUrl="markers/hiro.patt" onMarkerFound={() => setSpawn(true)}>
          <Physics gravity={[0, -10, 0]}>
            {hasSpawned && <EngramCannonWrapper position={[0, 2, 0]} />}
            <Floor />
          </Physics>
        </ARMarker>
        <Preload all />
        {/* <OrbitControls /> */}
        {/* <CameraControls /> */}
      </ARCanvas>
    </>
  )
}
