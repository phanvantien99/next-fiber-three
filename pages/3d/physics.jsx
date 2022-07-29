import { usePlane, Physics, useSphere, useBox } from "@react-three/cannon";
import { Center, OrbitControls, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { useControls, button } from "leva";
import { DirectionalLightHelper } from "three";
import styles from "./text.module.css";

const Physics3D = () => {
  const [boxes, setBoxes] = useState(0);
  const [sphere, setSphere] = useState(0);
  const sound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/hit.mp3") : undefined
  );

  useControls(
    {
      "Create box": button(() => setBoxes(boxes + 1)),
      "Create sphere": button(() => setSphere(sphere + 1)),
      Reset: button(() => {
        setBoxes(0);
        setSphere(0);
      }),
    },
    [boxes, sphere]
  );

  const playHitSound = (collision) => {
    const impactStrength = collision.contact.impactVelocity;
    const hitSound = sound.current;
    if (impactStrength > 1.5) {
      hitSound.volume = Math.random();
      hitSound.currentTime = 0;
      hitSound.play();
    }
  };
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 75, position: [0, 5, 10] }}
      className={styles.haunted_canvas}
    >
      <OrbitControls />
      <Physics
        broadphase="SAP"
        allowSleep
        gravity={[0, -9.82,   0]}
        defaultContactMaterial={{ friction: 0.1, restitution: 0.7 }}
      >
        <Scence boxes={boxes} spheres={sphere} hitSound={playHitSound} />
      </Physics>
    </Canvas>
  );
};

const Scence = ({ boxes, spheres, hitSound }) => {
  const dirRef = useRef();
  useHelper(dirRef, DirectionalLightHelper, 1, "#3fc70c");
  const [planeRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    args: [20, 20, 20],
  }));

  return (
    <>
      {/* <Center> */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-1, 2, 0]}
        intensity={0.3}
        castShadow
        ref={dirRef}
      />
      <mesh ref={planeRef} receiveShadow>
        <planeBufferGeometry args={[20, 20, 20]} />
        <meshStandardMaterial
          roughness={0.3}
          metalness={0.1}
          side={THREE.DoubleSide}
          color={"#7F8487"}
        />
      </mesh>
      {new Array(boxes).fill(null).map((_, index) => {
        return (
          <>
            <Box key={index} playHitSound={hitSound} />
          </>
        );
      })}
      {new Array(spheres).fill(null).map((_, index) => {
        return (
          <>
            <Sphere key={index} playHitSound={hitSound} />
          </>
        );
      })}
      {/* </Center> */}
    </>
  );
};

const Sphere = ({ playHitSound }) => {
  const values = useMemo(() => {
    const radius = Math.random() * 0.5;
    const x = Math.random() - 0.5;
    const y = 3;
    const z = Math.random() - 0.5;
    return { radius, x, y, z };
  }, []);

  const [sphereRef] = useSphere(() => ({
    position: [values.x, values.y, values.z],
    mass: 1,
    args: [values.radius],
    onCollide: (e) => playHitSound(e),
  }));
  return (
    <>
      <mesh ref={sphereRef} castShadow>
        <sphereBufferGeometry args={[values.radius, 32, 15]} />
        <meshStandardMaterial roughness={0.3} metalness={0.1} />
      </mesh>
    </>
  );
};

const Box = ({ playHitSound }) => {
  const values = useMemo(() => {
    const x = (Math.random() - 0.5) * 3;
    const y = 3;
    const z = (Math.random() - 0.5) * 3;
    const w = Math.random();
    const h = Math.random();
    const d = Math.random();
    return { x, y, z, w, d, h };
  }, []);
  const [boxRef] = useBox(() => ({
    position: [values.x, values.y, values.z],
    mass: 2,
    args: [values.w, values.h, values.d],
    onCollide: (e) => playHitSound(e),
  }));

  return (
    <>
      <mesh ref={boxRef} castShadow>
        <boxBufferGeometry args={[values.w, values.h, values.d]} />
        <meshStandardMaterial roughness={0.3} metalness={0.1} />
      </mesh>
    </>
  );
};

export default Physics3D;
