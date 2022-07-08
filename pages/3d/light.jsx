import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  OrbitControls,
  Text3D,
  useHelper,
  useTexture,
} from "@react-three/drei";
import styles from "./text.module.css";
import * as THREE from "three";
import { SpotLightHelper } from "three";

const Light = () => {
  return (
    <Canvas
      className={styles.webgl_light}
      camera={{ fov: 75, position: [0, 0, 20] }}
    >
      <OrbitControls />
      <Scence />
    </Canvas>
  );
};

const Scence = () => {
  const material = {
    roughness: 0.4,
    metalness: 0.1,
  };

  const cubeRef = useRef();
  const torusRef = useRef();
  const spotRef = useRef();

  useHelper(spotRef, SpotLightHelper);

  useFrame(({ clock }) => {
    const elaps = clock.getElapsedTime();
    cubeRef.current.rotation.x = 0.1 * elaps;
    cubeRef.current.rotation.y = 0.5 * elaps;
    torusRef.current.rotation.x = 0.1 * elaps;
    torusRef.current.rotation.y = 0.5 * elaps;
  });

  // useLayoutEffect(() => {
  //   console.log(spotRef.current);
  //   if (!spotRef.current) return;
  //   spotRef.current.lookAt(new THREE.Vector3(0, 0, -3));
  // });
  //
  return (
    <>
      <ambientLight intensity={`1`} color={`#ee7963`} />
      {/* <directionalLight /> */}
      {/* <hemisphereLight color={"#e6d5b8"} groundColor="#fff" intensity="1" /> */}
      <spotLight
        ref={spotRef}
        intensity={0.3}
        angle={10}
        position={[0, 7, 0]}
        
        // target={new THREE.Object3D(3, 7, 2)}
        penumbra="5"
        decay={2}
      />
      <Center>
        {/* plane */}
        <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[10, -3, 0]}>
          <planeBufferGeometry args={[30, 30]} />
          <meshStandardMaterial {...material} side={THREE.DoubleSide} />
        </mesh>
        {/* box */}
        <mesh position={[0, 0, 0]} ref={cubeRef}>
          <boxBufferGeometry args={[3, 3, 3]} />
          <meshStandardMaterial roughness={0.3} />
        </mesh>
        {/* circle */}
        <mesh position={[10, 0, 0]}>
          <sphereBufferGeometry args={[2, 32, 16]} />
          <meshStandardMaterial roughness={0.3} />
        </mesh>
        {/* torus */}
        <mesh position={[20, 0, 0]} ref={torusRef}>
          <torusBufferGeometry args={[2, 0.8, 16, 100]} />
          <meshStandardMaterial roughness={0.3} />
        </mesh>
      </Center>
    </>
  );
};

export default Light;
