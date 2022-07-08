import { Canvas, useFrame } from "@react-three/fiber";
import styles from "./text.module.css";
import { OrbitControls, Center, useTexture } from "@react-three/drei";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const ParticlePage = () => {
  return (
    <>
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 75 }}
        className={styles.haunted_canvas}
      >
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
        <Particle count={10000} />
      </Center>
    </>
  );
};

const Particle = ({ count }) => {
  const bufferRef = useRef();
  const pointRef = useRef();
  const clock = new THREE.Clock();

  const position = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    position[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }

  const pointMat = useTexture({
    alphaMap: "/textures/particles/2.png",
  });

  useLayoutEffect(() => {
    if (!bufferRef) return;
    bufferRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(position, 3)
    );
    bufferRef.current.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bufferRef.current]);

  useFrame(() => {
    if (!pointRef || !bufferRef) return;
    const elaps = clock.getElapsedTime();
    // pointRef.current.rotation.y = elaps * 0.2;
    for (let i = 0; i < count; i++) {
      let i3 = i * 3;
      const x = bufferRef.current.attributes.position.array[i3];
      bufferRef.current.attributes.position.array[i3 + 1] = Math.sin(elaps + x);
    }

    bufferRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointRef}>
        <bufferGeometry ref={bufferRef} />
        <pointsMaterial
          transparent
          size={0.1}
          sizeAttenuation={true}
          // color={new THREE.Color("#ff88cc")}
          {...pointMat}
          // alphaTest={0.01}
          // depthTest={false}
          depthWrite={false} // recommendation using
          blending={THREE.AdditiveBlending} // this make effect to performance
          vertexColors
        />
      </points>
    </>
  );
};

export default ParticlePage;
