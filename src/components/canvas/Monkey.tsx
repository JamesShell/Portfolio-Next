import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, extend, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload, useAnimations, useGLTF } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import {
  Box3,
  ExtrudeGeometry,
  LoopRepeat,
  Mesh,
  PerspectiveCamera,
  ShapeGeometry,
  Vector3,
} from "three";
import AsciiRenderer from "./AsciiRenderer";

// Extend three to include ExtrudeGeometry
extend({ ExtrudeGeometry });

// Type definitions
interface MonkeyProps {
  isMobile: boolean;
  lightPosition: [number, number, number];
}

interface IconProps {
  hovered: keyof typeof ICONS_COLORS;
}

interface MonkeyCanvasProps {
  className?: string;
  hovered: keyof typeof ICONS_COLORS;
}

// Initialize camera
const camera = new PerspectiveCamera(
  25,
  16 / 9,
  0.1,
  1000
);
camera.position.set(20, 0, 5);

// Define possible icon colors
const ICONS_COLORS = {
  "": -1,
  about: 2,
  work: 3,
  contact: 4,
} as const;

type IconKey = keyof typeof ICONS_COLORS;

const Monkey: React.FC<MonkeyProps> = ({ isMobile, lightPosition }) => {
  const { scene, animations } = useGLTF("./computer/robot.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions["Take 001"]) {
      actions["Take 001"].setLoop(LoopRepeat, 100); // Set to repeat
      actions["Take 001"].play();
    }
  }, [actions]);

  return (
    <mesh>
      <hemisphereLight intensity={1.5} groundColor="white" />
      <pointLight intensity={15} position={lightPosition} />
      <spotLight
        intensity={20}
        castShadow
        position={[-1, 5, 0]}
        penumbra={1}
        angle={0.12}
      />
      <primitive
        object={scene}
        scale={isMobile ? 2 : 2.4}
        position={[0, -3, 0]}
        rotation={[0, 1, 0]}
      />
    </mesh>
  );
};

const Icon = ({ hovered }: { hovered: IconKey }) => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--glowing-text-color",
      `var(--chart-${ICONS_COLORS[hovered]})`
    );

    return () => {
      document.documentElement.style.setProperty(
        "--glowing-text-color",
        `var(--chart-1`
      );
    };
  }, [hovered]);

  const svgData = useLoader(SVGLoader, `./icons/${hovered}.svg`);
  const shapes = useMemo(() => {
    return svgData.paths.map((p) => p.toShapes(true));
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
    const center = new Vector3();
    boundingBox.getCenter(center);
    return center;
  }, [boundingBox]);

  return (
    <mesh
      scale={0.01}
      rotation={[Math.PI, 0, 0]}
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

const MonkeyCanvas: React.FC<MonkeyCanvasProps> = ({ className, hovered }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lightPosition, setLightPosition] = useState<[number, number, number]>([0, 0, 10]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");

    setIsMobile(mediaQuery.matches);

    const mediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", mediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", mediaQueryChange);
    };
  }, []);

  // Update light position based on mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setLightPosition([x, y, 10]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Adjust OrbitControls after the component has mounted
    const controls = document.querySelector("OrbitControls");
    if (controls) {
      controls.start();
    }
  }, []);

  return (
    <Canvas
      className={className}
      frameloop="demand"
      shadows
      camera={camera}
      gl={{ preserveDrawingBuffer: true }}>
      <Suspense>
        <OrbitControls
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          enableZoom={false}
          enableDamping={false}
          enablePan={false}
          autoRotate={!isHovered}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        {!hovered ? (
          <Monkey isMobile={isMobile} lightPosition={lightPosition} />
        ) : (
          <Icon hovered={hovered} />
        )}

        <AsciiRenderer fgColor="orange" bgColor="transparent" characters=" ■■■*+=-:." resolution={0.18} invert={false} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default MonkeyCanvas;
