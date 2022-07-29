import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./text.module.css";

const ModifyModel = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 75, position: [0, 5, 10] }}
      className={styles.haunted_canvas}
    >
      <OrbitControls />
      <Center>
        <Scence />
      </Center>
    </Canvas>
  );
};

const Scence = () => {
  const models = useGLTF("/models/hamburger.gltf");
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.2} castShadow={true} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
        <planeBufferGeometry args={[10, 10]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          roughness={0.3}
          color={`#7F8487`}
        />
      </mesh>
      <mesh position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} castShadow={true}>
        <primitive object={models.scene} />
      </mesh>
    </>
  );
};

export default ModifyModel;
