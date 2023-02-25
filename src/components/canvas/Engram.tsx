import * as THREE from 'three'
import { useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import usePostProcess from '@/templates/hooks/usePostprocess'

export default function Engram({ ...props }) {
    const mesh = useRef(null)
    const gltf = useLoader(GLTFLoader, './models/engram.glb');

    return (
        <group ref={mesh} {...props}>
            <primitive object={gltf.scene} />
        </group>
    )
}
