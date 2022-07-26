import { Center, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import styles from "./text.module.css";
import * as THREE from "three";
import { useControls } from "leva";
import vertexShader from "../../shaders/galaxy/vertex.glsl";
import fragmentShader from "../../shaders/galaxy/fragment.glsl";

const Galaxy = () => {
  return (
    <>
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 75, position: [0, 5, 15] }}
        className={styles.haunted_canvas}
        // position={[1, 1, 2]}
      >
        <OrbitControls />
        <Scence />
      </Canvas>
    </>
  );
};

const Scence = () => {
  const bufferRef = useRef();
  const shaderRef = useRef();
  const {
    count,
    size,
    radius,
    branches,
    spin,
    randomnessPower,
    insideColor,
    outsideColor,
  } = useControls({
    count: {
      value: 20000,
      min: 100,
      max: 100000,
      step: 100,
    },
    size: { value: 0.04, min: 0.001, max: 0.1, step: 0.001 },
    radius: { value: 17.3, min: 0.01, max: 20, step: 0.01 },
    branches: { value: 3, min: 3, max: 10, step: 1 },
    spin: { value: 0.9, min: 0, max: 2, step: 0.01 },
    randomness: { value: 0, min: 0, max: 2, step: 0.001 },
    randomnessPower: { value: 7.6, min: 1, max: 10, step: 0.001 },
    insideColor: { value: "#00e435", a: 0.4 },
    outsideColor: { value: "#e89000", a: 0.4 },
  });

  const parameters = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scale = new Float32Array(count * 1);
    const randomness = new Float32Array(count * 3);

    const colorInside = new THREE.Color(insideColor);
    const colorOutside = new THREE.Color(outsideColor);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const _radius = Math.random() * radius;
      const spinAngle = _radius * spin;
      const brachAngle = ((i % branches) / branches) * Math.PI * 2;

      positions[i3] = Math.cos(brachAngle + spinAngle) * _radius;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = Math.sin(brachAngle + spinAngle) * _radius;

      //randomness
      const randomX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      randomness[i3] = randomX;
      randomness[i3 + 1] = randomY;
      randomness[i3 + 2] = randomZ;

      // colors
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, _radius / radius);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      //   colors[i3] = 1;
      //   colors[i3 + 1] = 0;
      //   colors[i3 + 2] = 0;

      //scales
      scale[i] = Math.random();
    }

    return { positions, colors, scale, randomness };
  }, [
    branches,
    count,
    insideColor,
    outsideColor,
    radius,
    randomnessPower,
    spin,
  ]);

  useLayoutEffect(() => {
    if (!bufferRef || !shaderRef) return;

    bufferRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(parameters.positions, 3)
    );
    bufferRef.current.setAttribute(
      "color",
      new THREE.BufferAttribute(parameters.colors, 3)
    );

    bufferRef.current.setAttribute(
      "aScale",
      new THREE.BufferAttribute(parameters.scale, 1)
    );

    bufferRef.current.setAttribute(
      "aRandomness",
      new THREE.BufferAttribute(parameters.randomness, 3)
    );

    const uniform = shaderRef.current.uniforms;
    uniform.uSize = { value: 8 * Math.min(window.devicePixelRatio, 2) };
    uniform.uTime = { value: 0 };
  }, [
    parameters.positions,
    parameters.colors,
    parameters.scale,
    parameters.randomness,
  ]);

  const clock = new THREE.Clock();
  useFrame(() => {
    if (!shaderRef) return;
    const elaps = clock.getElapsedTime();
    shaderRef.current.uniforms.uTime.value = elaps;
  });

  return (
    <>
      <Center>
        <points>
          <bufferGeometry ref={bufferRef} />
          <shaderMaterial
            ref={shaderRef}
            depthWrite={false}
            vertexColors={true}
            blending={THREE.AdditiveBlending}
            // color={color}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
        </points>
      </Center>
    </>
  );
};

export default Galaxy;
