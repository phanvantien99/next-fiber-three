import { Center, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import styles from "./text.module.css";

const Raycaster = () => {
  const cameraRef = useRef();
  return (
    <>
      <Canvas
        ref={cameraRef}
        dpr={[1, 2]}
        camera={{ fov: 75 }}
        className={styles.haunted_canvas}
      >
        <OrbitControls />
        <Center>
          <Scence />
        </Center>
      </Canvas>
    </>
  );
};

const Scence = () => {
  const sphereLeft = useRef();
  const sphereMiddle = useRef();
  const sphereRight = useRef();
  const rayRef = useRef();

  const clock = new THREE.Clock();
  const mouse = new THREE.Vector2();

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerWidth) * 2 + 1;
  });

  useFrame(() => {
    if (
      !sphereLeft.current ||
      !sphereMiddle.current ||
      !sphereRight.current ||
      !rayRef.current
    )
      return;
    const elaps = clock.getElapsedTime();
    sphereLeft.current.position.y = Math.sin(elaps * 0.3) * 1.5;
    sphereMiddle.current.position.y = Math.sin(elaps * 0.5) * 1.5;
    sphereRight.current.position.y = Math.sin(elaps * 0.7) * 1.5;

    rayRef.current.setFromCamera(mouse);

    //cast a ray

    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(1, 0, 0);
    // rayDirection.normalize();
    // rayRef.current.set(rayOrigin, rayDirection);
    // const objectToTest = [
    //   sphereLeft.current,
    //   sphereMiddle.current,
    //   sphereRight.current,
    // ];
    // const intersects = rayRef.current.intersectObjects(objectToTest);
    // for (const intersect of intersects) {
    //   intersect.object.material.color.set("#e6d5b8");
    // }
  });

  return (
    <>
      <group>
        <raycaster ref={rayRef} />
        <mesh position={[-2, 0, 0]} ref={sphereLeft}>
          <sphereGeometry args={[0.5, 16, 32]} />
          <meshBasicMaterial color={new THREE.Color("#ff0000")} />
        </mesh>
        <mesh position={[0, 0, 0]} ref={sphereMiddle}>
          <sphereGeometry args={[0.5, 16, 32]} />
          <meshBasicMaterial color={new THREE.Color("#ff0000")} />
        </mesh>
        <mesh position={[2, 0, 0]} ref={sphereRight}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color={new THREE.Color("#ff0000")} />
        </mesh>
      </group>
    </>
  );
};

const Ray = () => {
  return <></>;
};

export default Raycaster;
