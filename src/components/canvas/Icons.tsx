"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import {
  Box3,
  ExtrudeGeometry,
  Mesh,
  ShapeGeometry,
  Vector3,
} from "three";
import AsciiRenderer from "./AsciiRenderer";
import { extend } from "@react-three/fiber";

extend({ ExtrudeGeometry });

export type IconKey = "about" | "work" | "contact" | ""; // Add more if needed

interface IconCanvasProps {
  icon: IconKey;
  rotationValue?: number; // should be a float between 0 and 1
  className?: string;
}

const Icon: React.FC<{ icon: IconKey; rotationValue?: number, isMobile: boolean }> = ({
  icon,
  rotationValue = 0,
  isMobile,
}) => {
  const svgData = useLoader(SVGLoader, `/icons/${icon}.svg`);

  const shapes = useMemo(() => {
    return svgData.paths.flatMap((path) => path.toShapes(true));
  }, [svgData]);

  const boundingBox = useMemo(() => {
    const box = new Box3();
    shapes.forEach((shape) => {
      const geometry = new ShapeGeometry(shape);
      box.expandByObject(new Mesh(geometry));
    });
    return box;
  }, [shapes]);

  const center = useMemo(() => {
    const vec = new Vector3();
    boundingBox.getCenter(vec);
    return vec;
  }, [boundingBox]);

  return (
   <mesh
      scale={isMobile ? .2 : .08}
      rotation={[Math.PI, rotationValue * Math.PI * 5, 0]}
      position={[0, 0, 0]}>
      {shapes.map((s, i) => (
        <mesh key={i} position={[-center.x, -center.y, 0]}>
          <extrudeGeometry
            args={[
              s,
              {
                depth: 20,
                bevelEnabled: false,
                steps: 30,
              },
            ]}
          />
        </mesh>
      ))}
    </mesh>
  );
};

const IconCanvas: React.FC<IconCanvasProps> = ({
  icon,
  rotationValue,
  className,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 800px)");
    setIsMobile(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) =>
      setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Canvas
      className={className}
      shadows
      camera={{ position: [0, 0, 100], fov: 45 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        {icon && <Icon icon={icon} rotationValue={rotationValue} isMobile={isMobile} />}
        <AsciiRenderer
          fgColor="orange"
          bgColor="transparent"
          characters=" ■■■*+=-:."
          resolution={0.18}
          invert={false}
        />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default IconCanvas;