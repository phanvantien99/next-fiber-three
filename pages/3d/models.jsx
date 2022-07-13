import styles from "./text.module.css";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useMemo, useState } from "react";
import { useLayoutEffect } from "react";
import { useControls, button } from "leva";

const ImportModel = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{
        fov: 75,
        position: [0, 2, 5],
      }}
      shadows={true}
      className={styles.general}
    >
      <OrbitControls />
      <Scence />
    </Canvas>
  );
};

const Scence = () => {
  const [index, setIndex] = useState(0);
  const models = useGLTF("/models/Fox/glTF/Fox.gltf");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mixer = new THREE.AnimationMixer(models.scene);

  useControls({
    Idle: button(() => setIndex(0)),
    Walk: button(() => setIndex(1)),
    Sprint: button(() => setIndex(2)),
  });

  useFrame((state, delta) => {
    mixer?.update(delta);
  });

  useLayoutEffect(() => {
    const action = mixer.clipAction(models.animations[index]);
    action.play();
  }, [index, mixer, models.animations]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.2} castShadow={true} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
        <planeBufferGeometry args={[10, 10]} />
        <meshStandardMaterial side={THREE.DoubleSide} />
      </mesh>
      <mesh
        position={[0, 0.01, 0]}
        scale={[0.025, 0.025, 0.025]}
        castShadow={true}
      >
        <primitive object={models.scene} />
      </mesh>
      {/* {scene.children.map((_, index) => {
        return (
          
        );
      })} */}
    </>
  );
};

export default ImportModel;
