import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useHelper, useGLTF } from "@react-three/drei";
import { useControls } from 'leva';
import * as THREE from 'three';
import styles from "./text.module.css";
import { useRef } from "react";
import { DirectionalLightHelper } from 'three';

const Realistic = () => {

    return (
        <>
            <Canvas shadows={true}
                className={styles.webgl_light}
                dpr={[1, 2]}
                camera={{ fov: 75, position: [0, 5, 30] }}
                legacy={true}
                linear={true}
                gl={{
                    physicallyCorrectLights: true,
                }}
            >
                {/* <ambientLight intensity={.3} /> */}

                {/* <Center> */}
                <Render />
                {/* </Center> */}
                <OrbitControls />
            </Canvas>
        </>
    );

}

const Render = () => {
    const model = useGLTF(`/models/FlightHelmet/glTF/FlightHelmet.gltf`);
    // console.log('here',model);
    const directionRef = useRef();
    const { lightIntensity, lightX, lightY, lightZ } = useControls({
        lightIntensity: { value: 3, max: 10, min: 0, step: 0.001 },
        lightX: { value: 0.25, min: -5, max: 5, step: 0.001 },
        lightY: { value: 3, min: -5, max: 5, step: 0.001 },
        lightZ: { value: -2.25, min: -5, max: 5, step: 0.001 },
    });


    useHelper(directionRef, DirectionalLightHelper, 5, "#21ba45");
    return (<>
        <directionalLight
            ref={directionRef}
            args={[`#ffffff`, lightIntensity]}
            position={[lightX, lightY, lightZ]}
        />

        <mesh>
            <sphereBufferGeometry args={[16, 32, 16]} />
            <meshStandardMaterial />
        </mesh>
        <mesh>
            <primitive object={model.scene} />
        </mesh>
    </>);
}


export default Realistic;