import * as THREE from 'three';
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

const size = new THREE.Vector2();

const useBufferSize = () => {
    const [bufferSize, setBufferSize] = useState({ width: 0, height: 0 });
    const { gl } = useThree();

    useEffect(() => {
        const handleResize = () => {
            gl.getSize(size);
            setBufferSize({ width: size.x, height: size.y });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        gl.xr.addEventListener('sessionstart', handleResize);
        gl.xr.addEventListener('sessionend', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            gl.xr.removeEventListener('sessionstart', handleResize);
            gl.xr.removeEventListener('sessionend', handleResize);
        }
    })

    return bufferSize;
}

export default useBufferSize;