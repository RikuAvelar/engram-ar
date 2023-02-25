import * as THREE from 'three';
import { useThree, extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { EffectComposer, RenderPass, EffectPass, BloomEffect } from 'postprocessing';
import useBufferSize from '../hooks/useBufferSize';

// extend({ EffectComposer, RenderPass, EffectPass });

export default function Effects() {
    const { gl, scene, camera } = useThree();
    const { width, height } = useBufferSize();
    const composer = useRef<EffectComposer>();

    useEffect(() => {
        if (!gl) return;
        composer.current = new EffectComposer(gl);
        // composer.current.addPass(new RenderPass(scene, camera));
        // composer.current.addPass(new EffectPass(camera, new BloomEffect()));
    }, [gl]);

    useEffect(() => void composer?.current.setSize(width, height), [width, height]);

    useFrame(() => {
        if (!composer.current) return;
        if (!gl.xr.isPresenting) return composer.current.render();

        gl.xr.enabled = false;

        gl.xr.updateCamera(camera);

        const { cameras } = gl.xr.getCamera();
        cameras.forEach(({ viewport, matrixWorld, projectionMatrix }) => {
            gl.setViewport(viewport);
            camera.position.setFromMatrixPosition(matrixWorld);
            camera.projectionMatrix.copy(projectionMatrix);

            composer.current.render();
        });

        gl.setViewport(0, 0, width, height);
        gl.xr.updateCamera(camera);
        gl.xr.enabled = true;
    }, 1);

    return <></>;

    // return (
    //     <effectComposer ref={composer} args={[gl]}>
    //         <renderPass attach={['addPass', 'removePass']} args={[scene, camera]} />
    //         <effectPass attach={['addPass', 'removePass']} args={[camera, bloom]} />
    //     </effectComposer>
    // )
}