/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 engram.glb --transform
*/
import { exotic } from '@/templates/constants';
import { ConvexPolyhedronProps, Triplet, useConvexPolyhedron } from '@react-three/cannon';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { BufferGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { Geometry } from 'three-stdlib';
import Particles from './Particles';

function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

interface EngramGLTF {
  materials: Record<string, MeshStandardMaterial>;
  nodes: Record<string, { geometry: BufferGeometry }>;
}

const SCALE = 1.2;

const Engram = forwardRef<Mesh>(function EngramExoticComponent(props, ref) {
  const { nodes, materials } = useGLTF('/models/engram-transformed.glb') as unknown as EngramGLTF;
  const [age, setAge] = useState(0);
  useEffect(() => {
    materials['Dark Faces'].color = new THREE.Color('#000000');
    materials['Dark Faces'].emissiveIntensity = 0;
    materials['Dark Faces'].opacity = 0.5;
  }, [materials]);

  useFrame(() => {
    if (age <= 200) {
      setAge(age + 1);
    }
  });

  const mainScale = 0.01 + easeOutQuint(age / 200) * SCALE;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Casing.geometry} scale={mainScale} ref={ref}>
        {/* <MeshTransmissionMaterial transmission={1} /> */}
        <MeshTransmissionMaterial background={exotic} color={exotic} transmission={.35} roughness={.2} thickness={3.5} ior={1.01} chromaticAberration={0.005} metalness={0.35} distortionScale={0} temporalDistortion={0} />
        <group scale={0.33}>
          <mesh geometry={nodes.Solid003.geometry} material={materials['Center Glow']} />
          <mesh geometry={nodes.Solid003_1.geometry} material={materials['Dark Faces']} />
        </group>
        <group scale={0.92}>
          <mesh geometry={nodes.Solid009.geometry} material={materials['Ring 1']} />
          <mesh geometry={nodes.Solid009_1.geometry} material={materials['Dark Faces']} />
        </group>
        <group scale={0.92}>
          <mesh geometry={nodes.Solid008.geometry} material={materials['Ring 2']} />
          <mesh geometry={nodes.Solid008_1.geometry} material={materials['Dark Faces']} />
        </group>
        <group scale={0.92}>
          <mesh geometry={nodes.Solid007.geometry} material={materials['Ring 3']} />
          <mesh geometry={nodes.Solid007_1.geometry} material={materials['Dark Faces']} />
        </group>
        <group scale={0.92}>
          <mesh geometry={nodes.Solid005.geometry} material={materials['Ring 4']} />
          <mesh geometry={nodes.Solid005_1.geometry} material={materials['Dark Faces']} />
        </group>
        <group scale={0.92}>
          <mesh geometry={nodes.Solid004.geometry} material={materials['Ring 5']} />
          <mesh geometry={nodes.Solid004_1.geometry} material={materials['Dark Faces']} />
        </group>
        <group scale={0.92}>
          <mesh geometry={nodes.Solid002.geometry} material={materials['Ring 6']} />
          <mesh geometry={nodes.Solid002_1.geometry} material={materials['Dark Faces']} />
        </group>
        <group scale={0.92}>
          <mesh geometry={nodes.Solid001.geometry} material={materials['Ring 7']} />
          <mesh geometry={nodes.Solid001_1.geometry} material={materials['Dark Faces']} />
        </group>
        <group scale={0.92}>
          <mesh geometry={nodes.Solid006.geometry} material={materials['Ring 8']} />
          <mesh geometry={nodes.Solid006_1.geometry} material={materials['Dark Faces']} />
        </group>
      </mesh>
    </group>
  )
});

// Returns legacy geometry vertices, faces for ConvP
function toConvexProps(bufferGeometry: BufferGeometry, scale = SCALE): ConvexPolyhedronProps['args'] {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry)
  // Merge duplicate vertices resulting from glTF export.
  // Cannon assumes contiguous, closed meshes to work
  geo.mergeVertices()
  return [geo.vertices.map((v) => [v.x * scale, v.y * scale, v.z * scale]), geo.faces.map((f) => [f.a, f.b, f.c]), []]
}

export default function EngramCannonWrapper({ position }: { position?: Triplet }) {
  const { nodes } = useGLTF('/models/engram-transformed.glb') as unknown as EngramGLTF;
  const origin = useMemo(() => new Vector3(), []);

  const args = toConvexProps(nodes.Casing.geometry, SCALE);

  const [ref, api] = useConvexPolyhedron(() => ({
    args,
    mass: 100,
    position,
  }), useRef<Mesh>(null));

  useEffect(() => {
    api.position.subscribe(pos => {
      origin.set(...pos);
    });

    setTimeout(() => {
      api.applyImpulse([0, 1_000, 0], [0, 0, 0]);
      api.applyTorque([30000 * Math.random(), 30000 * Math.random(), 30000 * Math.random()])
    }, 30)
  }, [api, origin])

  return (
    <>
      <Particles origin={origin} />
      <Engram ref={ref} />
    </>
  )
}