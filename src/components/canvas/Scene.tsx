import { Canvas } from '@react-three/fiber'
import { CameraControls, OrbitControls, Preload } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Physics, usePlane } from '@react-three/cannon';
import { XR, ARButton } from '@react-three/xr';
// import { Debug, Physics, RigidBody } from '@react-three/rapier';

const Effects = dynamic(() => import('@/templates/providers/effectsProvider'), { ssr: false });

const Floor = () => {
  const [floor] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
    type: 'Static',
  }))

  return <mesh ref={floor as any}>
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
            {/* <mesh receiveShadow>
              <boxGeometry args={[100, 100, 0.5]} />
              <meshStandardMaterial color="gray" transparent opacity={0} />
            </mesh> */}
          </Physics>
          <Preload all />
        </XR>
        {/* <OrbitControls /> */}
        {/* <CameraControls /> */}
      </Canvas>
    </>
  )
}
