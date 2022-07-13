import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useMemo } from "react";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import styles from "./text.module.css";

const Scrollbase = () => {
  return (
    <>
      <Canvas dpr={[1, 2]} camera={{ fov: 75 }} className={styles.scrollbase}>
        <Scence />
      </Canvas>
    </>
  );
};

const Scence = () => {
  const [color, setColor] = useState("#ffeded");
  const { _color } = useControls({
    _color: { value: "#ffeded" },
  });

  useLayoutEffect(() => {
    setColor(_color);
  }, [_color, color]);

  return (
    <>
      <directionalLight position={[1, 1, 0]} />
      <mesh>
        <torusBufferGeometry args={[1, 0.4, 16, 60]} />
        <meshToonMaterial color={color} />
      </mesh>
      <mesh>
        <coneBufferGeometry args={[1, 2, 32]} />
        <meshToonMaterial color={color} />
      </mesh>
      <mesh>
        <torusKnotBufferGeometry args={[0.8, 0.35, 100, 16]} />
        <meshToonMaterial color={color} />
      </mesh>
    </>
  );
};

export default Scrollbase;
