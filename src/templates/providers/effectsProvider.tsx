import * as THREE from 'three';
import { useThree, extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import useBufferSize from '../hooks/useBufferSize';
import { Bloom, EffectComposer, SMAA, SSR, Vignette } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

// extend({ EffectComposer, RenderPass, EffectPass });

export default function Effects() {
    // return <></>;
    return (
        <EffectComposer>
            {/* <Bloom width={500} /> */}
            <Bloom intensity={1.15} radius={0.8} luminanceThreshold={0.1} luminanceSmoothing={.7} kernelSize={KernelSize.LARGE} />
            {/* <SSR /> */}
        </EffectComposer>
    )
}