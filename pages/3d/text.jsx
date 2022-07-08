import { useLayoutEffect, useRef, useState } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  OrbitControls,
  Text3D,
  useTexture,
} from "@react-three/drei";
import styles from "./text.module.css";
import monterat from "../../public/static/fonts/Montserrat Black_Regular.json";

const TextPage = () => {
  return (
    <Canvas className={styles.webgl} camera={{ fov: 75, position: [0, 0, 20] }}>
      <axesHelper args={[10, 10, 10]} />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Scence />
    </Canvas>
  );
};

const Scence = () => {
  const matcap = useTexture({
    matcap: "/textures/matcaps/4.png",
  });
  const textOptions = {
    size: 1.5,
    height: 2,
    curveSegments: 16,
    bevelEnabled: true,
    bevelSegments: 13,
    bevelThickness: 0.07,
    beveltSize: 1,
    bevelOffset: 0,
  };
  return (
    <>
      <Text3DWFont font={monterat} textOptions={textOptions} matcap={matcap} />
      {new Array(300).fill(null).map((_, index) => {
        return <Donut matcap={matcap} key={index} />;
      })}
    </>
  );
};

const Donut = ({ matcap }) => {
  // const donutMesh = useRef();
  // useLayoutEffect(() => {
  //   if (donutMesh.current) {
  //     donutMesh.current.rotation.x = Math.random() * Math.PI;
  //     donutMesh.current.rotation.y = Math.random() * Math.PI;
  //   }
  // }, []);

  const x = (Math.random() - 0.5) * 100;
  const y = (Math.random() - 0.5) * 100;
  const z = (Math.random() - 0.5) * 100;

  const rotationX = Math.random() * Math.PI;
  const rotationY = Math.random() * Math.PI;
  // const rotationZ = Math.random() * Math.PI;

  return (
    <mesh
      position={[x, y, z]}
      // ref={donutMesh}
      rotation={[rotationX, rotationY, 0]}
    >
      <torusBufferGeometry args={[0.8, 0.4, 16, 64]} />
      <meshMatcapMaterial {...matcap} />
    </mesh>
  );
};

const Text3DWFont = (props) => {
  const { font, textOptions, matcap } = props;
  return (
    <Center>
      <Text3D font={font} {...textOptions} >
        Hello Me!!
        <meshMatcapMaterial {...matcap} />
      </Text3D>
    </Center>
  );
};

export default TextPage;
