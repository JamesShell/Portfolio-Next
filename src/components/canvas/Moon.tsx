import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import AsciiRenderer from "./AsciiRenderer";

const Moon = () => {
  const moon = useGLTF("./lp_moon/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={1.2}
      groundColor="black"/>
      <primitive object={moon.scene} scale={0.24} position-y={-2.5} rotation-y={0}/>
    </mesh>
  );
};

const MoonCanvas: React.FC<React.CanvasHTMLAttributes<HTMLCanvasElement>> = (props) => {
  return (
    <Canvas
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
      {...props}
    >
      <Suspense>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Moon />

        <Preload all />
        <AsciiRenderer fgColor="orange" bgColor="transparent" invert={false} />
      </Suspense>
    </Canvas>
  );
};

export default MoonCanvas;