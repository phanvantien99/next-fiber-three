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
import { SpotLightHelper, DirectionalLightHelper } from "three";

const Shadow = () => {
  return (
    <Canvas
      //   legacy={true}

      // shadows={true}
      className={styles.webgl_light}
      camera={{ fov: 75, position: [0, 0, 20] }}
    >
      <OrbitControls />
      <Scence />
    </Canvas>
  );
};

const Scence = () => {
  const props = useTexture({
    alphaMap: "/textures/shadows/simpleShadow.jpg",
  });
  const material = {
    roughness: 0.4,
    metalness: 0.1,
  };

  // const cubeRef = useRef();
  // const torusRef = useRef();
  const spotRef = useRef();
  const directRef = useRef();
  const sphereRef = useRef();
  const shadowRef = useRef();
  useFrame(({ clock }) => {
    const elaps = clock.getElapsedTime();
    sphereRef.current.position.x = Math.cos(elaps * 1.5) * 10 + 10;
    sphereRef.current.position.z = Math.sin(elaps * 1.5) * 10;
    sphereRef.current.position.y = Math.abs(Math.cos(elaps * 5) * 3) - 1;

    //shadow
    shadowRef.current.position.x = sphereRef.current.position.x;
    shadowRef.current.position.z = sphereRef.current.position.z;
    shadowRef.current.material.opacity = 1 - sphereRef.current.position.y * 0.3;
  });

  useLayoutEffect(() => {
    // if (directRef.current && spotRef.current) {
    //Directional
    // const directionShadow = directRef.current.shadow;
    // directionShadow.mapSize.width = 1024 * 2;
    // directionShadow.mapSize.height = 1024 * 2;
    // directionShadow.radius = 10;
    //   directionShadow.camera.top = 10;
    //   directionShadow.camera.let = 2;
    //   directionShadow.camera.right = 2;
    // directionShadow.camera.near = 1;
    //   directionShadow.camera.far = 12;
    // spotlight
    // const spotShadow = spotRef.current.shadow;
    // spotShadow.mapSize.width = 1024 * 2;
    // spotShadow.mapSize.height = 1024 * 2;
    // }
  });

  return (
    <>
      <ambientLight intensity={0.4} color={`#ffff `} />
      <directionalLight
        ref={directRef}
        color={new THREE.Color("#ffff")}
        intensity={0.4}
        position={[3, 5, 0]}
        castShadow={true}
      />
      {/* <directionalLight /> */}
      {/* <hemisphereLight color={"#e6d5b8"} groundColor="#fff" intensity="1" /> */}
      <spotLight
        ref={spotRef}
        intensity={0.5}
        angle={2}
        position={[0, 7, -6]}
        penumbra="5"
        decay={2}
        castShadow={true}
      />
      <Center>
        {/* plane */}
        <mesh
          rotation={[-Math.PI * 0.5, 0, 0]}
          position={[10, -3, 0]}
          receiveShadow={true}
        >
          <planeBufferGeometry args={[30, 30]} />
          <meshStandardMaterial {...material} side={THREE.DoubleSide} />
        </mesh>
        <mesh
          rotation={[-Math.PI * 0.5, 0, 0]}
          position={[10, -2.99, 0]}
          receiveShadow={true}
          ref={shadowRef}
        >
          <planeBufferGeometry args={[7, 7]} />
          <meshStandardMaterial
            {...props}
            side={THREE.DoubleSide}
            transparent
            color={new THREE.Color("#202124")}
          />
        </mesh>
        {/* box */}
        {/* <mesh position={[0, 0, 0]} ref={cubeRef} castShadow={true}>
          <boxBufferGeometry args={[3, 3, 3]} />
          <meshStandardMaterial roughness={0.3} />
        </mesh> */}
        {/* sphere */}
        <mesh position={[10, -1, 0]} castShadow={true} ref={sphereRef}>
          <sphereBufferGeometry args={[2, 32, 16]} />
          <meshStandardMaterial roughness={0.3} />
        </mesh>
        {/* torus */}
        {/* <mesh position={[20, 0, 0]} ref={torusRef}>
          <torusBufferGeometry args={[2, 0.8, 16, 100]} />
          <meshStandardMaterial roughness={0.3} />
        </mesh> */}
      </Center>
    </>
  );
};

export default Shadow;
