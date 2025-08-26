import React, { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { Canvas, extend, useLoader, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useAnimations, useGLTF } from "@react-three/drei";
import {
  Box3,
  ExtrudeGeometry,
  LoopRepeat,
  Mesh,
  PerspectiveCamera,
  ShapeGeometry,
  Vector3,
} from "three";
import { lerp } from "three/src/math/MathUtils.js";

// Extend three to include ExtrudeGeometry
extend({ ExtrudeGeometry });

// Type definitions
interface AboutCharacterProps {
  isMobile: boolean;
  lightPosition: [number, number, number];
}

interface AboutCanvasProps {
  className?: string;
}

// Initialize camera with a fixed aspect ratio optimized for About section
const aboutCamera = new PerspectiveCamera(
  45,
  1, // Will be updated dynamically
  0.1,
  1000
);
aboutCamera.position.set(0, 0, 8);

// Aspect Ratio Controller component
const AspectRatioController: React.FC = () => {
  const { camera, size } = useThree();
  
  useEffect(() => {
    // Maintain consistent aspect ratio for About section
    const minAspect = 0.8;
    const maxAspect = 1.5;
    const targetAspect = Math.max(minAspect, Math.min(maxAspect, size.width / size.height));
    
    camera.aspect = targetAspect;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
};

const AboutCharacter: React.FC<AboutCharacterProps> = ({ isMobile, lightPosition }) => {
  const { scene, animations } = useGLTF("./space_boi/space_boi.glb");
  const bodyRef = useRef<any>();
  const wavesRef = useRef<any[]>([]);
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const [animationPhase, setAnimationPhase] = useState(0);

  React.useEffect(() => {
    console.log("About Character Animations:");
    console.log(animations);
    
    // Find and setup scene objects for About section
    scene.traverse((child) => {
      // Hide particles
      if (child.name === "particles") {
        child.visible = false;
      }
      
      // Hide main cube
      if (child.name === "Cube") {
        child.visible = false;
      }
      
      // Hide specific spheres
      if (child.name === "Sphere011" || child.name === "Sphere010" || child.name === "Sphere009") {
        child.visible = false;
      }

      // Hide ALL planets for About section
      if (child.name === "Sphere" || 
          child.name === "Sphere001" || 
          child.name.startsWith("Sphere00")) {
        child.visible = false;
      }

      // Setup body object for flip-up animation
      if (child.name === "body") {
        bodyRef.current = child;
        console.log("Found body object for About: " + child.name);
        // Start from bottom, upside down
        bodyRef.current.position.y = -8;
        bodyRef.current.rotation.x = Math.PI; // Start flipped
        bodyRef.current.scale.set(120, 120, 120); // Slightly larger for About section
      }
      
      // Setup waves but keep them minimal
      if (child.name.startsWith("waves") && child.type === "Object3D") {
        wavesRef.current.push(child);
        child.position.set(0, 0, 0);
        child.visible = false; // Hide waves in About section for clean look
        console.log("Found waves object for About: " + child.name);
      }

      console.log("About Scene child: " + child.name, " type: " + child.type);
    });

    // Start the flip animation after component mounts
    const timer = setTimeout(() => setAnimationPhase(1), 500);
    return () => clearTimeout(timer);
  }, [scene, animations]);

  useFrame((state) => {
    // About-specific body animation - flip up from bottom
    if (bodyRef.current && animationPhase === 1) {
      // Target position: center of view
      const targetY = 0;
      const targetRotationX = 0; // Normal orientation
      
      // Smooth lerp animation
      bodyRef.current.position.y = lerp(bodyRef.current.position.y, targetY, 0.03);
      bodyRef.current.rotation.x = lerp(bodyRef.current.rotation.x, targetRotationX, 0.03);
      
      // Gentle floating animation once in position
      if (Math.abs(bodyRef.current.position.y - targetY) < 0.5) {
        const floatOffset = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
        bodyRef.current.position.y = targetY + floatOffset;
        
        // Subtle breathing-like scale animation
        const breathingScale = 120 + Math.sin(state.clock.elapsedTime * 1.2) * 3;
        bodyRef.current.scale.set(breathingScale, breathingScale, breathingScale);
        
        // Very subtle rotation
        bodyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      }
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enableDamping={true}
        dampingFactor={0.1}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      <mesh>
        <hemisphereLight intensity={1.8} groundColor="white" />
        <pointLight intensity={12} position={lightPosition} />
        <spotLight
          intensity={15}
          castShadow
          position={[2, 3, 2]}
          penumbra={1}
          angle={0.15}
        />
        <primitive
          object={scene}
          scale={1}
          position={[0, -1, 0]}
          rotation={[0, 0.5, 0]}
        />
      </mesh>
    </>
  );
};

const AboutCanvas: React.FC<AboutCanvasProps> = ({ className }) => {
  const [isMobile, setIsMobile] = useState(false);

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
      camera={aboutCamera}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={null}>
        <AspectRatioController />
        <AboutCharacter 
          isMobile={isMobile} 
          lightPosition={[2, 2, 5]} 
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default AboutCanvas;