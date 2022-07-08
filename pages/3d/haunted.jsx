import { OrbitControls, useHelper, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import styles from "./text.module.css";
import * as THREE from "three";
import { useEffect, useLayoutEffect, useRef } from "react";
import { PointLightHelper } from "three";

const HauntedHouse = () => {
  return (
    <Canvas
      shadows={true}
      className={styles.haunted_canvas}
      camera={{ fov: 75, position: [0, 2, 10] }}
      onCreated={(state) => {
        state.scene.fog = new THREE.Fog("#262837", 1, 15);
        state.gl.setClearColor("#262837");
      }}
    >
      {/* <fog args={["#202124", 1, 6]} /> */}
      <OrbitControls />
      <Scence />
    </Canvas>
  );
};

const Scence = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      {/* <directionalLight intensity={0.2} /> */}
      <Ground />
      <House />
      {new Array(55).fill(null).map((_, index) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 4;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <>
            <Grave key={index} x={x} z={z} />
          </>
        );
      })}
      <Ghost />
    </>
  );
};

const Ground = () => {
  const name = (type) => `/textures/grass/${type}.jpg`;
  const [map, aoMap, normalMap, roughnessMap] = useTexture([
    // map: "/textures/grass/color.jpg",
    // aoMap: "/textures/grass/ambientOcclusion.jpg",
    // normalMap: "/textures/grass/normal.jpg",
    // roughnessMap: "/textures/grass/roughness.jpg",
    name("color"),
    name("ambientOcclusion"),
    name("normal"),
    name("roughness"),
  ]);

  map.repeat.set(8, 8);
  aoMap.repeat.set(8, 8);
  normalMap.repeat.set(8, 8);
  roughnessMap.repeat.set(8, 8);

  map.wrapS = THREE.RepeatWrapping;
  aoMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapS = THREE.RepeatWrapping;

  map.wrapT = THREE.RepeatWrapping;
  aoMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeBufferGeometry args={[15, 15]} />
        <meshStandardMaterial
          //   side={THREE.DoubleSide}
          //   color={new THREE.Color("#809A6F")}
          map={map}
          aoMap={aoMap}
          roughnessMap={roughnessMap}
          normalMap={normalMap}
        />
      </mesh>
    </>
  );
};

const House = () => {
  const doorTexture = useTexture({
    map: "/textures/door/color.jpg",
    alphaMap: "/textures/door/alpha.jpg",
    aoMap: "/textures/door/ambientOcclusion.jpg",
    displacementMap: "/textures/door/height.jpg",

    normalMap: "/textures/door/normal.jpg",
    metalnessMap: "/textures/door/metalness.jpg",
    roughnessMap: "/textures/door/roughness.jpg",
  });

  const wallTextures = useTexture({
    map: "/textures/bricks/color.jpg",
    aoMap: "/textures/bricks/ambientOcclusion.jpg",
    normalMap: "/textures/bricks/normal.jpg",
    roughnessMap: "/textures/bricks/roughness.jpg",
  });

  const pointRef = useRef();
  const doorRef = useRef();
  const wallRef = useRef();

  useEffect(() => {
    if (!doorRef || !wallRef) return;
    doorRef.current.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        doorRef.current.geometry.attributes.uv.array,
        2
      )
    );
    wallRef.current.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        wallRef.current.geometry.attributes.uv.array,
        2
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doorRef.current, wallRef.current]);

  useHelper(pointRef, PointLightHelper, 0.3, "#3fc70c");

  return (
    <>
      <group>
        <pointLight
          castShadow={true}
          ref={pointRef}
          args={["#ff7d46", 0.5, 0]}
          position={[0, 1, 2]}
          //   rotation={[-Math.PI / 2, 0, 0]}
        />
        {/*wall*/}
        <mesh position={[0, 0.76, 0]} ref={wallRef} castShadow={true}>
          <boxBufferGeometry args={[3, 1.5, 3]} />
          <meshStandardMaterial {...wallTextures} />
        </mesh>
        {/*roof*/}
        <mesh
          castShadow={true}
          position={[0, 1.5 + 0.5, 0]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <coneBufferGeometry args={[3, 1, 4]} />
          <meshStandardMaterial color={new THREE.Color("#ee7963")} />
        </mesh>
        {/*door*/}
        <mesh position={[0, 0.45, 1.51]} ref={doorRef}>
          <planeBufferGeometry args={[1.2, 1, 100, 100]} />
          <meshStandardMaterial
            transparent={true}
            displacementScale={0.1}
            roughness={0.1}
            {...doorTexture}
          />
        </mesh>
        {/*bush*/}
        <mesh castShadow={true} position={[1.2, 0.1, 1.6]}>
          <sphereBufferGeometry args={[0.4, 32, 16]} />
          <meshStandardMaterial color={new THREE.Color("#146356")} />
        </mesh>
        <mesh position={[0.7, 0.1, 1.6]}>
          <sphereBufferGeometry args={[0.2, 32, 16]} />
          <meshStandardMaterial color={new THREE.Color("#146356")} />
        </mesh>
        <mesh position={[-0.7, 0.1, 1.6]}>
          <sphereBufferGeometry args={[0.3, 32, 16]} />
          <meshStandardMaterial color={new THREE.Color("#146356")} />
        </mesh>
        <mesh position={[-0.7, 0.1, 1.9]}>
          <sphereBufferGeometry args={[0.17, 32, 16]} />
          <meshStandardMaterial color={new THREE.Color("#146356")} />
        </mesh>
        <mesh position={[-1.15, 0.1, 1.7]}>
          <sphereBufferGeometry args={[0.35, 32, 16]} />
          <meshStandardMaterial color={new THREE.Color("#146356")} />
        </mesh>
      </group>
    </>
  );
};

const Grave = ({ x, z }) => {
  return (
    <>
      <mesh
        castShadow={true}
        position={[x, 0.2, z]}
        rotation={[0, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.4]}
      >
        <boxBufferGeometry args={[0.3, 0.4, 0.1]} />
        <meshStandardMaterial color={new THREE.Color("#b2b6b1")} />
      </mesh>
    </>
  );
};

const Ghost = () => {
  const ghostRef1 = useRef();
  const ghostRef2 = useRef();
  const ghostRef3 = useRef();

  const clock = new THREE.Clock();
  useFrame(() => {
    if (!ghostRef1 || !ghostRef2 || !ghostRef3) return;
    const elaps = clock.getElapsedTime();
    const ghost1Angle = elaps;
    ghostRef1.current.position.x = Math.cos(ghost1Angle) * 4;
    ghostRef1.current.position.z = Math.sin(ghost1Angle) * 4;
    ghostRef1.current.position.y = Math.sin(elaps * 3);

    const ghost2Angle = -elaps * 0.32;
    ghostRef2.current.position.x = Math.cos(ghost2Angle) * 6;
    ghostRef2.current.position.z = Math.sin(ghost2Angle) * 6;
    ghostRef2.current.position.y = Math.sin(elaps * 3);

    const ghost3Angle = -elaps * 0.18;
    ghostRef3.current.position.x = Math.cos(ghost3Angle) * 4;
    ghostRef3.current.position.z = Math.sin(ghost3Angle) * 4;
    ghostRef3.current.position.y = Math.sin(elaps * 3);
  });
  return (
    <>
      <pointLight
        castShadow={true}
        ref={ghostRef1}
        color={new THREE.Color("#9A0680")}
        intensity={1}
      />
      <pointLight
        castShadow={true}
        ref={ghostRef2}
        color={new THREE.Color("#270082")}
        intensity={1}
      />
      <pointLight
        castShadow={true}
        ref={ghostRef3}
        color={new THREE.Color("#950101")}
        intensity={1}
      />
    </>
  );
};
export default HauntedHouse;
