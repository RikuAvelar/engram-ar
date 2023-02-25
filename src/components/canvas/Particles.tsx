import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from 'react'
import { MeshTransmissionMaterial, Points, useGLTF } from '@react-three/drei'
import { exotic } from '@/templates/constants'
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry, DynamicDrawUsage, LineBasicMaterial, LineSegments } from 'three';

const PARTICLE_COUNT = 150;
const MAX_CONNECTIONS = 3;
const CONNECT_DIST = 1.5;

const STARTING_RADIUS = 0.5;
const LIFETIME = 100;
const DECAY_TIME = 300;
const LIFE_VARIANCE = 150;
const INITIAL_VELOCITY = .0001;

const MAX_FLOAT = 0.01;
const MAX_SPREAD = 0.015;

const STARTING_AGE_RANGE = 200;

const DRAG = 0.009;
const BUOYANCY = 0.01;


const applyDrag = (value: number) => value - (value * DRAG);
const applyBuoyancy = (value: number, variance = 0) => {
    const max = MAX_FLOAT + variance * MAX_FLOAT
    const progress = Math.min(max, Math.max(-max, max - value));

    return value + progress * BUOYANCY;
};

function easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

const initialVelocity = (val = INITIAL_VELOCITY) => -val + Math.random() * 2 * val;

const createSytem = () => {
    const segmentCount = PARTICLE_COUNT ** 2;
    const linePositions = new Float32Array(segmentCount * 3);
    const lineColors = new Float32Array(segmentCount * 4);

    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 4);
    const particleData = Array(PARTICLE_COUNT).fill(undefined).map(() => ({
        velocity: new THREE.Vector3(initialVelocity(MAX_SPREAD), initialVelocity(MAX_FLOAT), initialVelocity(MAX_SPREAD)),
        numConnections: 0,
        age: Math.floor(Math.random() * STARTING_AGE_RANGE),
        lifetime: LIFETIME + Math.floor((2 * Math.random() * LIFE_VARIANCE) - LIFE_VARIANCE),
        speedVariance: (Math.random() + 0.5) / 2,
    }));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const [x, y, z] = Array(3).fill(undefined).map(() => Math.random() * STARTING_RADIUS - STARTING_RADIUS / 2);

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;
    }

    particles.setDrawRange(0, PARTICLE_COUNT);
    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));
    particles.setAttribute('color', new THREE.BufferAttribute(particleColors, 4).setUsage(THREE.DynamicDrawUsage));

    // const cloud = new THREE.Points(particles, PointMaterial);
    const lines = new BufferGeometry();

    lines.setAttribute('position', new BufferAttribute(linePositions, 3).setUsage(DynamicDrawUsage));
    lines.setAttribute('color', new BufferAttribute(lineColors, 4).setUsage(DynamicDrawUsage));

    lines.computeBoundingSphere();
    lines.setDrawRange(0, 0);

    // const linesMesh = new LineSegments(lines, LineMaterial);

    return {
        lines,
        linePositions,
        lineColors,
        // linesMesh,

        particles,
        particlePositions,
        particleData,
        particleColors,
        // cloud,

        count: PARTICLE_COUNT,
    };
};

const P_SIZE = 0.025;
const L_SIZE = 1;

const Particles = () => {
    const system = useMemo(createSytem, []);

    const PointMaterial = useMemo(() => new THREE.PointsMaterial({
        color: exotic,
        vertexColors: true,
        size: P_SIZE,
        blending: THREE.AdditiveBlending,
        transparent: true,
        // sizeAttenuation: false,
    }), [P_SIZE]);

    const LineMaterial = useMemo(() => new LineBasicMaterial({
        color: exotic,
        vertexColors: true,
        blending: AdditiveBlending,
        transparent: true,
        linewidth: L_SIZE
    }), [L_SIZE]);

    useFrame(() => {
        const { particlePositions, particleColors, linePositions, lineColors, lines, particles, particleData } = system;
        let vertexPointer = 0;
        let colorPointer = 0;
        let partColorPointer = 0;
        let numConnected = 0;

        // Reset Connections, Age Particles, and reset them them if needed
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const data = system.particleData[i];
            if (!data) break;
            data.numConnections = 0;
            data.age += 1;

            if (data.age > data.lifetime + DECAY_TIME) {
                // Reincarnate particle
                data.age = 0;
                data.velocity.set(initialVelocity(MAX_SPREAD), initialVelocity(MAX_FLOAT), initialVelocity(MAX_SPREAD));
                data.lifetime = LIFETIME + Math.floor((2 * Math.random() * LIFE_VARIANCE) - LIFE_VARIANCE);
                data.speedVariance = (Math.random() + 0.5) / 2;

                const [pX, pY, pZ] = Array(3).fill(i).map((i, j) => 3 * i + j);
                const [x, y, z] = Array(3).fill(undefined).map(() => Math.random() * STARTING_RADIUS - STARTING_RADIUS / 2);

                particlePositions[pX] = x;
                particlePositions[pY] = y;
                particlePositions[pZ] = z;
            }

        }

        // Handle particle position and line connections
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const data = particleData[i];
            const [pX, pY, pZ] = [
                i * 3,
                i * 3 + 1,
                i * 3 + 2,
            ]

            // Apply Velocity
            particlePositions[pX] += data.velocity.x;
            particlePositions[pY] += data.velocity.y;
            particlePositions[pZ] += data.velocity.z;

            // Apply drag and buoyancy to velocity
            particleData[i].velocity.set(
                applyDrag(particleData[i].velocity.x),
                applyBuoyancy(particleData[i].velocity.y, particleData[i].speedVariance),
                applyDrag(particleData[i].velocity.z),
            );

            const decay = Math.max(0, data.age - data.lifetime) / DECAY_TIME;
            const strength = Math.max(0, 1 - easeInOutCubic(decay));
            // system.particles.
            // const color = exotic.clone().multiplyScalar(strength);
            particleColors[partColorPointer++] = strength;
            particleColors[partColorPointer++] = strength;
            particleColors[partColorPointer++] = strength;
            particleColors[partColorPointer++] = strength;

            // console.log(strength);

            if (particleData[i].numConnections >= MAX_CONNECTIONS) {
                continue;
            }

            // Check collisions
            for (let j = i + 1; j < PARTICLE_COUNT; j++) {

                if (particleData[j].numConnections >= MAX_CONNECTIONS || particleData[i].numConnections >= MAX_CONNECTIONS) {
                    continue;
                }

                const [pnX, pnY, pnZ] = [
                    j * 3,
                    j * 3 + 1,
                    j * 3 + 2,
                ]

                const [dx, dy, dz] = [
                    particlePositions[pX] - particlePositions[pnX],
                    particlePositions[pY] - particlePositions[pnY],
                    particlePositions[pZ] - particlePositions[pnZ],
                ];
                const dist = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

                if (dist < CONNECT_DIST) {
                    // Calculate alpha and decary first. Refuse the connection if strength (alpha) is too weak
                    const maxDecay = Math.max(Math.max(0, particleData[i].age - particleData[i].lifetime), Math.max(0, particleData[j].age - particleData[j].lifetime))
                    const decay = easeInOutCubic(maxDecay / DECAY_TIME);
                    const alpha = Math.max(0, (1 - dist / CONNECT_DIST) - decay);

                    if (alpha === 0) continue;

                    particleData[i].numConnections++;
                    particleData[j].numConnections++;

                    linePositions[vertexPointer++] = particlePositions[pX];
                    linePositions[vertexPointer++] = particlePositions[pY];
                    linePositions[vertexPointer++] = particlePositions[pZ];

                    linePositions[vertexPointer++] = particlePositions[pnX];
                    linePositions[vertexPointer++] = particlePositions[pnY];
                    linePositions[vertexPointer++] = particlePositions[pnZ];

                    lineColors[colorPointer++] = alpha;
                    lineColors[colorPointer++] = alpha;
                    lineColors[colorPointer++] = alpha;
                    lineColors[colorPointer++] = alpha;

                    lineColors[colorPointer++] = alpha;
                    lineColors[colorPointer++] = alpha;
                    lineColors[colorPointer++] = alpha;
                    lineColors[colorPointer++] = alpha;

                    numConnected += 1;
                }
            }
        }

        // Set updates
        lines.setDrawRange(0, numConnected * 2);
        lines.attributes.position.needsUpdate = true;
        lines.attributes.color.needsUpdate = true;

        particles.attributes.position.needsUpdate = true;
        particles.attributes.color.needsUpdate = true;
    });

    return (
        <>
            <lineSegments geometry={system.lines} material={LineMaterial} />
            {/* <Points geometry={system.particles} material={PointMaterial} /> */}
            <points geometry={system.particles} material={PointMaterial} />
        </>
    );
}

export default Particles;