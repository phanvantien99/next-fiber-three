import { Canvas, useFrame } from "@react-three/fiber";
import styles from "./text.module.css";
import { OrbitControls, Center } from "@react-three/drei";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const ParticlePage = () => {
  return (
    <>
      <Canvas camera={{ fov: 75 }} className={styles.haunted_canvas}>
        <OrbitControls />
        <Scence />
      </Canvas>
    </>
  );
};

const Scence = () => {
  return (
    <>
      <Center>
        <Particle count={600} />
      </Center>
    </>
  );
};

const Particle = ({ count }) => {
  const bufferRef = useRef();
  const position = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    position[i] = (Math.random() - 0.5) * 10;
  }

  const clock = new THREE.Clock();
  useFrame(() => {
    if (!bufferRef) return;
    const elaps = clock.getElapsedTime();
    bufferRef.current.rotateY(0.001);
    bufferRef.current.rotateX(0.001);
  });

  useLayoutEffect(() => {
    if (!bufferRef) return;
    bufferRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(position, 3)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bufferRef.current]);
  return (
    <>
      <points>
        <bufferGeometry ref={bufferRef} />
        <pointsMaterial size={0.02} sizeAttenuation={true} />
      </points>
    </>
  );
};

export default ParticlePage;
