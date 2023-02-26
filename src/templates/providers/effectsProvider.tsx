import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

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