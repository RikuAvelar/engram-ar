import { Canvas } from '@react-three/fiber'
import { CameraControls, OrbitControls, Preload } from '@react-three/drei'
import dynamic from 'next/dynamic'

const Effects = dynamic(() => import('@/templates/providers/effectsProvider'), { ssr: false });

export default function Scene({ children, ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props}>
      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      <Effects />
      {children}
      <Preload all />
      {/* <OrbitControls /> */}
      <CameraControls />
    </Canvas>
  )
}
