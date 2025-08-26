import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { AnimationMixer, PerspectiveCamera, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import AsciiRenderer from "./AsciiRenderer";

// Type definitions
interface AsteroidsProps {
  isMobile: boolean;
}

interface AsteroidsCanvasProps {
  className?: string;
}

// Initialize camera
const astroidsCamera = new PerspectiveCamera(
  45,
  1, // Will be updated dynamically
  0.1,
  2000
);
astroidsCamera.position.set(0, 0, 10);

// Aspect Ratio Controller component
const AspectRatioController: React.FC = () => {
  const { camera, size } = useThree();
  
  useEffect(() => {
    const targetAspect = size.width / size.height;
    camera.aspect = targetAspect;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
};

const WanderingAsteroids: React.FC<AsteroidsProps> = ({ isMobile }) => {
  const { scene, animations } = useGLTF("./wandering_asteroids_of_andromeda.glb");
  const groupRef = useRef<any>();
  const asteroidsRef = useRef<any[]>([]);
  const { camera } = useThree();

  // Play first animation if available
  useEffect(() => {
    if (animations && animations.length > 0) {
      const mixer = new AnimationMixer(scene);
      const action = mixer.clipAction(animations[0]);
      action.play();

      return () => {
        action.stop();
      };
    }
  })

  useEffect(() => {
    console.log("Wandering Asteroids loaded:");
    console.log(scene);
    
    // Find and store asteroid objects for animation
    scene.traverse((child) => {
      if (child.isMesh) {
        asteroidsRef.current.push(child);
        console.log("Found asteroid mesh: " + child.name);
      }
    });

    // Set overall scale based on device
    if (groupRef.current) {
      const scale = isMobile ? 0.2 : 0.4;
      groupRef.current.scale.set(scale, scale, scale);
    }
  }, [scene, isMobile]);

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enableDamping={true}
        dampingFactor={0.05}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />
      
      {/* Lighting setup for asteroids */}
      <ambientLight intensity={0.4} />
      <directionalLight
        intensity={0.8}
        position={[10, 10, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight intensity={0.5} position={[-10, -10, -10]} color="#0066ff" />
      <pointLight intensity={0.3} position={[10, -10, 10]} color="#ff6600" />

      <group ref={groupRef}>
        <primitive
          object={scene}
          scale={1}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
        />
      </group>
    </>
  );
};

const AsteroidsCanvas: React.FC<AsteroidsCanvasProps> = ({ className }) => {
  const [isMobile, setIsMobile] = React.useState(false);

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

  return (
    <Canvas
      className={className}
      shadows
      camera={astroidsCamera}
      gl={{ 
        preserveDrawingBuffer: true,
        antialias: false,
        alpha: true
      }}
    >
      <Suspense fallback={null}>
        <AspectRatioController />
        <WanderingAsteroids isMobile={isMobile} />
        
        {/* ASCII Renderer Effect */}
        <AsciiRenderer 
          fgColor="white" 
          bgColor="transparent" 
          characters=" ■■■@*+=-:." 
          resolution={0.2}
          invert={false}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default AsteroidsCanvas;