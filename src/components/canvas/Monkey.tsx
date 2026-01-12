import React, { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { Canvas, extend, useLoader, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useAnimations, useGLTF, useFBX } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import {
  Box3,
  ExtrudeGeometry,
  LoopRepeat,
  Mesh,
  PerspectiveCamera,
  ShapeGeometry,
  Vector3,
  AnimationMixer,
} from "three";
import AsciiRenderer from "./AsciiRenderer";
import { Stars } from "./Stars";
import { lerp } from "three/src/math/MathUtils.js";
import { ppid } from "process";
import GlobalLoader, { BlinkingSmiley } from "../ui/global-loader";

// Extend three to include ExtrudeGeometry
extend({ ExtrudeGeometry });

// Type definitions
interface MonkeyProps {
  isMobile: boolean;
  lightPosition: [number, number, number];
  hovered: IconKey;
  onLoaded?: () => void;
}

interface IconProps {
  hovered: keyof typeof ICONS_COLORS;
}

interface MonkeyCanvasProps {
  className?: string;
  hovered: keyof typeof ICONS_COLORS;
}

// Initialize camera with a fixed aspect ratio
const camera = new PerspectiveCamera(
  28,
  1, // Will be updated dynamically
  0.1,
  1000
);
camera.position.set(8, 0, -2);

// Define possible icon colors
const ICONS_COLORS = {
  "": -1,
  about: 2,
  work: 3,
  contact: 4,
  github: 2,
  linkedin: 3,
  twitter: 4,
  dribbble: 2,
} as const;

type IconKey = keyof typeof ICONS_COLORS;

// Camera positions for different hover states
const CAMERA_POSITIONS = {
  "": { position: [8, 0, -2], target: [0, -.8, 0] },
  about: { position: [5, -6, 0], target: [0, 0, 0] }, // Zoom into body
  work: { position: [5, -5, -3], target: [2, 1.5, -3.15] }, // Zoom into planets area
  contact: { position: [2, -1, 10], target: [-1, 1, 3.5] }, // Zoom into other planets
  github: { position: [5, -6, 0], target: [0, 0, 0] },
  linkedin: { position: [5, -5, -3], target: [2, 1.5, -3.15] },
  twitter: { position: [2, -1, 10], target: [-1, 1, 3.5] },
  dribbble: { position: [5, -6, 0], target: [0, 0, 0] },
} as const;

// Aspect Ratio Controller component
const AspectRatioController: React.FC = () => {
  const { camera, size } = useThree();
  
  useEffect(() => {
    // Maintain consistent aspect ratio regardless of container size
    const minAspect = 0.8; // Minimum aspect ratio
    const maxAspect = 2.0;  // Maximum aspect ratio
    const targetAspect = Math.max(minAspect, Math.min(maxAspect, size.width / size.height));
    
    camera.aspect = targetAspect;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
};


const Monkey: React.FC<MonkeyProps> = ({ isMobile, lightPosition, hovered, onLoaded }) => {
  const { scene, animations } = useGLTF("./space_boi/space_boi.glb");
  
  // Load the skinned character (only this one has the mesh/skin)
  const fbxCharacter = useFBX("./space_boi/animations/idle/animated_idle.fbx");
  
  // Load animation-only files (no skin, just animation data)
  const idleAnimations = {
    lookingAround: useFBX("./space_boi/animations/idle/Looking Around.fbx"),
    animatedIdle: useFBX("./space_boi/animations/idle/animated_idle.fbx")
  };
  
  const hoverAnimations = {
    cockyHeadTurn: useFBX("./space_boi/animations/on_hover/Cocky Head Turn.fbx"),
    headNodYes: useFBX("./space_boi/animations/on_hover/Head Nod Yes.fbx")
  };
  
  const afterHoverAnimations = {
    nervouslyLookAround: useFBX("./space_boi/animations/after_hover/Nervously Look Around.fbx"),
    standCoverToLook: useFBX("./space_boi/animations/after_hover/Stand Cover To Look.fbx")
  };
  
  const particlesRef = useRef<any>();
  const planetsRef = useRef<any[]>([]);
  const bodyRef = useRef<any>();
  const characterRef = useRef<any>();
  const wavesRef = useRef<any[]>([]);
  const mixerRef = useRef<AnimationMixer>();
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const [scrollY, setScrollY] = useState(0);
  const targetBodyY = useRef(0);
  const currentBodyY = useRef(0);
  const [currentAnimationSet, setCurrentAnimationSet] = useState<'idle' | 'hover' | 'afterHover'>('idle');
  const [currentAction, setCurrentAction] = useState<any>(null);
  const previousHovered = useRef<IconKey>('');
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecoveringFromHover, setIsRecoveringFromHover] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Limit scrollY to a maximum value for better control
      setScrollY(window.scrollY > 220 ? 220 : window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Setup FBX character animation with random selection
  const getRandomAnimationData = (animationSet: any) => {
    const keys = Object.keys(animationSet);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return animationSet[randomKey];
  };
  
  const playRandomAnimation = React.useCallback((animationType: 'idle' | 'hover' | 'afterHover', force: boolean = false) => {
    if (!mixerRef.current || !characterRef.current || !isInitialized) return;
    
    // Clear any existing timeout first to prevent conflicts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = undefined;
    }
    
    // Always reset animation state when forced or switching types
    if (force || currentAnimationSet !== animationType) {
      setIsAnimationPlaying(false);
    }
    
    // Don't interrupt non-idle animations unless forced
    if (!force && isAnimationPlaying && currentAnimationSet !== 'idle') {
      console.log(`Skipping ${animationType} animation - current animation still playing`);
      return;
    }
    
    let selectedAnimationFBX;
    switch (animationType) {
      case 'idle':
        // 70% chance to use default animated_idle, 30% chance for variation
        if (Math.random() < 0.7) {
          selectedAnimationFBX = idleAnimations.animatedIdle;
        } else {
          // Get random variation (exclude the default one)
          const variations = Object.entries(idleAnimations).filter(([key]) => key !== 'animatedIdle');
          const randomVariation = variations[Math.floor(Math.random() * variations.length)];
          selectedAnimationFBX = randomVariation[1];
        }
        break;
      case 'hover':
        selectedAnimationFBX = getRandomAnimationData(hoverAnimations);
        break;
      case 'afterHover':
        selectedAnimationFBX = getRandomAnimationData(afterHoverAnimations);
        break;
      default:
        selectedAnimationFBX = idleAnimations.animatedIdle;
    }
    
    if (selectedAnimationFBX && selectedAnimationFBX.animations && selectedAnimationFBX.animations.length > 0) {
      // Get current action reference
      const prevAction = currentAction;
      
      // Apply the animation from the animation-only FBX to our skinned character
      const newAction = mixerRef.current.clipAction(selectedAnimationFBX.animations[0], characterRef.current);
      
      // Handle transitions with improved smoothness
      if (prevAction && prevAction !== newAction) {
        if (force) {
          // For forced changes (hover interrupts), use quick but smooth transition
          const fadeTime = animationType === 'hover' ? 0.15 : 0.2;
          prevAction.fadeOut(fadeTime);
          newAction.reset().fadeIn(fadeTime).play();
        } else {
          // For gentle changes (idle variations), use longer smooth transition
          prevAction.fadeOut(0.3);
          newAction.reset().fadeIn(0.3).play();
        }
      } else {
        // No previous action or same action, just start normally with fade in
        newAction.reset().fadeIn(0.1).play();
      }
      
      // For idle animations, handle default vs variations differently
      if (animationType === 'idle') {
        const isDefaultIdle = selectedAnimationFBX === idleAnimations.animatedIdle;
        
        if (isDefaultIdle) {
          // Default animation loops infinitely
          newAction.setLoop(LoopRepeat, Infinity);
          setIsAnimationPlaying(false);
          
          // Set timeout to occasionally switch to a variation (8-15 seconds)
          const variationDelay = 6000 + Math.random() * 4000;
          animationTimeoutRef.current = setTimeout(() => {
            if (currentAnimationSet === 'idle' && !isAnimationPlaying) {
              playRandomAnimation('idle');
            }
          }, variationDelay);
        } else {
          // Variation animations play once then return to default
          newAction.setLoop(2200, 1);
          newAction.clampWhenFinished = true;
          setIsAnimationPlaying(true);
          
          const animationDuration = selectedAnimationFBX.animations[0].duration * 1000;
          animationTimeoutRef.current = setTimeout(() => {
            setIsAnimationPlaying(false);
            // Return to default idle animation
            setTimeout(() => {
              playRandomAnimation('idle');
            }, 100);
          }, animationDuration + 500);
        }
      } else {
        // For hover and after-hover animations, play once with shorter duration
        const maxDuration = animationType === 'hover' ? 2 : 3;
        const actualDuration = maxDuration;
        
        newAction.setLoop(2200, 1);
        newAction.clampWhenFinished = true;
        setIsAnimationPlaying(true);
        
        const timeoutDuration = actualDuration * 1000;
        animationTimeoutRef.current = setTimeout(() => {
          setIsAnimationPlaying(false);
          setCurrentAnimationSet('idle');
          // Set flag if this is afterHover finishing
          if (animationType === 'afterHover') {
            setIsRecoveringFromHover(true);
          }
          // Return to idle animation immediately without extra delay
          playRandomAnimation('idle');
        }, timeoutDuration);
      }
      
      setCurrentAction(newAction);
      console.log(`Playing ${animationType} animation:`, selectedAnimationFBX.animations[0].name);
    }
  }, [currentAction, idleAnimations, hoverAnimations, afterHoverAnimations, isInitialized, isAnimationPlaying, currentAnimationSet]);
  
  // Initialize skinned character and animation mixer (only once)
  React.useEffect(() => {
    if (fbxCharacter && fbxCharacter.animations && fbxCharacter.animations.length > 0 && !isInitialized) {
      console.log("Setting up skinned FBX character");
      
      // Setup animation mixer with the skinned character
      mixerRef.current = new AnimationMixer(fbxCharacter);
      
      // Setup character reference and initial positioning
      characterRef.current = fbxCharacter;
      fbxCharacter.position.set(0, -10, 0);
      fbxCharacter.scale.set(.01, .01, .01);
      
      // Play initial idle animation
      const initialAnimation = idleAnimations.animatedIdle;
      if (initialAnimation && initialAnimation.animations && initialAnimation.animations.length > 0) {
        const action = mixerRef.current.clipAction(initialAnimation.animations[0], fbxCharacter);
        action.setLoop(LoopRepeat, Infinity);
        action.play();
        setCurrentAction(action);
        console.log("Playing initial idle animation:", initialAnimation.animations[0].name);
      }
      
      setIsInitialized(true);
      setModelsLoaded(true);
      if (onLoaded) onLoaded();
      console.log("FBX Character setup complete");
    }
    
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [fbxCharacter]); // Remove playRandomAnimation from dependencies

  React.useEffect(() => {
    console.log("Space Boy Animations:");
    console.log(animations);
    
    // Find particles, planets in the scene (body is now replaced by FBX character)
    scene.traverse((child) => {
      if (child.name === "particles") {
        particlesRef.current = child;
        child.visible = false;
      }
      if (child.name === "Cube") {
        child.visible = false; // Hide the main sphere
      }
      // Hide the original body object since we're using FBX character
      if (child.name === "body") {
        child.visible = false;
        console.log("Hiding original body object: " + child.name);
      }
      // Find the waves object for animation
      if (child.name.startsWith("waves") && child.type === "Object3D") {
        // if(child.name !== "waves") {wavesRef.current.push(child);
        // // Set the pivot point (origin) to 0, 0, 0
        // child.position.set(0, 0, 0);
        // console.log("Found waves object: " + child.name);
        // console.log("Waves children: ", child.children);
        // console.log("Waves scale: ", child.scale);} else {
          
          child.visible = false;
        // child.scale.set(105, 105, .5); //
      }
      //Hide sphere 11 and 10
      if (child.name === "Sphere011" || child.name === "Sphere010"|| child.name === "Sphere009" || child.name === "Sphere008" || child.name === "Sphere007") {
        child.visible = false; // Hide the main sphere
      }

      // Find planets - group Sphere and Sphere001 as one object, then add others
      if (child.name === "Sphere" || child.name === "Sphere001") {
        // Create a group for Sphere and Sphere001 if it doesn't exist
        let sphereGroup = planetsRef.current.find(item => item.name === "SphereGroup");
        if (!sphereGroup) {
          sphereGroup = { name: "SphereGroup", children: [] };
          planetsRef.current.push(sphereGroup);
        }
        sphereGroup.children.push(child);
        console.log("Found planet: " + child.name + " (added to SphereGroup)");
      }
      //if statement to find all spheres named Sphere002 to Sphere008
      if (child.name.startsWith("Sphere00") && child.name !== "Sphere001") {
        planetsRef.current.push(child);
        console.log("Found planet: " + child.name);
      }

      console.log("Scene child: " + child.name, " type: " + child.type);
    });
  }, [scene, animations]);
  
  // Handle hover state changes for animation switching
  React.useEffect(() => {
    if (hovered !== previousHovered.current && isInitialized) {
      if (hovered && hovered !== '') {
        // Hovering over an element - play hover animation (force interrupt)
        setCurrentAnimationSet('hover');
        playRandomAnimation('hover', true);
      } else if (previousHovered.current && previousHovered.current !== '') {
        // Just stopped hovering - play after hover animation (force interrupt)
        setCurrentAnimationSet('afterHover');
        playRandomAnimation('afterHover', true);
      }
      
      previousHovered.current = hovered;
    }
  }, [hovered, isInitialized, playRandomAnimation]);
  
  // Backup timer for idle animations in case the main timeout fails
  React.useEffect(() => {
    if (currentAnimationSet === 'idle' && !isAnimationPlaying && isInitialized) {
      // Use short interval if recovering from hover (to fix stuck states)
      // Use normal interval for regular idle variations
      const interval = isRecoveringFromHover ? 100 : 8000 + Math.random() * 4000;
      
      console.log(`Setting backup timer: ${interval}ms (recovering: ${isRecoveringFromHover})`);
      
      const backupInterval = setInterval(() => {
        if (!isAnimationPlaying && currentAnimationSet === 'idle' && isInitialized) {
          console.log('Backup timer triggering idle animation switch');
          // Clear the recovery flag after first successful idle
          if (isRecoveringFromHover) {
            setIsRecoveringFromHover(false);
          }
          playRandomAnimation('idle');
        }
      }, interval);
      
      return () => clearInterval(backupInterval);
    }
  }, [currentAnimationSet, isAnimationPlaying, isInitialized, isRecoveringFromHover, playRandomAnimation]);

  useFrame((state, delta) => {
    // Update FBX animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // Ambient animation for the FBX character - gentle floating and subtle rotation
    if (characterRef.current) {
      targetBodyY.current = hovered === "" ? (-scrollY*.01)-3.25 : -3.25;
      
      // Lerp to smooth the movement
      characterRef.current.position.y = lerp(characterRef.current.position.y, targetBodyY.current, 0.25);
      
      characterRef.current.rotation.y = Math.PI/2 - .5 + Math.sin(state.clock.elapsedTime * .5) * 0.2;
      
      // rotate the waves list with the character
      if (wavesRef.current) {
        wavesRef.current.forEach((wave) => {
          if (wave.name !== "waves") {
            if(wave.name === "waves2")  {
              // Smooth scale transition based on scroll position
              const targetScale = characterRef.current.position.y > -180 ? 100 : 0;
              const currentScale = lerp(wave.scale.x, targetScale, 0.05);
              wave.scale.set(currentScale, currentScale, 1);
            }

            wave.rotation.z = characterRef.current.rotation.z;
          }
        })
      }
      
      // // Very subtle breathing-like scale animation
      // const scale = 0.01 + Math.sin(state.clock.elapsedTime * 1) * 0.001;
      // characterRef.current.scale.set(scale, scale, scale);
    }
    // Rotate planets around Y-axis at different speeds and hide based on scroll
    const shouldHidePlanets = scrollY > 100; // Hide planets when scrolled past 100px
    planetsRef.current.forEach((planet, index) => {
      if (planet.name === "SphereGroup") {
        // Handle the grouped Sphere and Sphere001
        planet.children.forEach((child: any, childIndex: number) => {
          child.visible = !shouldHidePlanets;
          if (child.visible) {
            child.position.applyAxisAngle(new Vector3(0, 1, 0), 0.005);
            child.rotation.z -= 0.025 + (childIndex * 0.01);
          }
        });
      } else if (planet) {
        // Handle individual planets
        planet.visible = !shouldHidePlanets;
        if (planet.visible) {
          planet.position.applyAxisAngle(new Vector3(0, 1, 0), 0.005);
          planet.rotation.z += 0.025 + (index * 0.001);
        }
      }
    });
    // Subtle wave scaling animation - only animate when scaling up
    if (wavesRef.current) {
      const scale = Math.sin(state.clock.elapsedTime * .5) * 20;
      wavesRef.current.forEach((wave) => {
        if(wave.name !== "waves2") {
          wave.scale.set(105 - Math.abs(scale), 105 - Math.abs(scale), .5);
        }
      });
    }

    // Dynamic camera positioning based on actual object locations
    if (hovered !== "" && controlsRef.current) {
      let targetPos = CAMERA_POSITIONS[hovered];
      
      // Override positions for work and contact with dynamic positioning
      if (hovered === "work" || hovered === "linkedin") {
        const sphereGroup = planetsRef.current.find(item => item.name === "SphereGroup");
        if (sphereGroup && sphereGroup.children.length > 0) {
          const refSphere = sphereGroup.children[0];
          const pos = refSphere.getWorldPosition(new Vector3());
          targetPos = {
            position: [pos.x + 3, pos.y + 2, pos.z + 3],
            target: [pos.x, pos.y, pos.z]
          };
        }
      } else if (hovered === "contact" || hovered === "twitter") {
        // Find Sphere003 for contact
        let sphere005: any = null;
        scene.traverse((child: any) => {
          if (child.name === "Sphere005") {
            sphere005 = child;
          }
        });
        if (sphere005) {
          const pos = sphere005.getWorldPosition(new Vector3());
          targetPos = {
            position: [pos.x + 3, pos.y + 2, pos.z + 3],
            target: [pos.x, pos.y, pos.z]
          };
        }
      }
      
      if (targetPos) {
        // Smooth camera position transition when hovered
        camera.position.lerp(new Vector3(...targetPos.position), 0.15);
        controlsRef.current.target.lerp(new Vector3(...targetPos.target), 0.15);
        controlsRef.current.update();
      }
    } else if (controlsRef.current) {
      // Return to default position when unhovered
      const defaultPos = CAMERA_POSITIONS[""];
      camera.position.lerp(new Vector3(...defaultPos.position), 0.075);
      controlsRef.current.target.lerp(new Vector3(...defaultPos.target), 0.075);
      controlsRef.current.update();
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
      autoRotate={!hovered}
      autoRotateSpeed={0.5}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2}
    />
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
        scale={1}
        position={[0, -2.6, 0]}
        rotation={[0, 1.3, 0]}
      />
    </mesh>
    
    {/* Add the FBX character to the scene */}
    {characterRef.current && (
      <primitive
        object={characterRef.current}
        scale={[.01, .01, .01]}
        position={[0, -3.25, 0]}
        rotation={[0, 0, 0]}
      />
    )}
    </>
    
  );
};

// const Icon = ({ hovered }: { hovered: IconKey }) => {
//   useEffect(() => {
//     document.documentElement.style.setProperty(
//       "--glowing-text-color",
//       `var(--chart-${ICONS_COLORS[hovered]})`
//     );

//     return () => {
//       document.documentElement.style.setProperty(
//         "--glowing-text-color",
//         `var(--chart-1`
//       );
//     };
//   }, [hovered]);

//   const svgData = useLoader(SVGLoader, `./icons/${hovered}.svg`);
//   const shapes = useMemo(() => {
//     return svgData.paths.map((p) => p.toShapes(true));
//   }, [svgData]);

//   const boundingBox = useMemo(() => {
//     const box = new Box3();
//     shapes.forEach((shape) => {
//       const geometry = new ShapeGeometry(shape);
//       box.expandByObject(new Mesh(geometry));
//     });
//     return box;
//   }, [shapes]);

//   const center = useMemo(() => {
//     const center = new Vector3();
//     boundingBox.getCenter(center);
//     return center;
//   }, [boundingBox]);

//   return (
//     <mesh
//       scale={0.01}
//       rotation={[Math.PI, 0, 0]}
//       position={[0, 0, 0]}>
//       {shapes.map((s, i) => (
//         <mesh key={i} position={[-center.x, -center.y, 0]}>
//           <extrudeGeometry
//             args={[
//               s,
//               {
//                 depth: 20,
//                 bevelEnabled: false,
//                 steps: 30,
//               },
//             ]}
//           />
//         </mesh>
//       ))}
//     </mesh>
//   );
// };


const MonkeyCanvas: React.FC<MonkeyCanvasProps> = ({ className, hovered }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    // Adjust OrbitControls after the component has mounted
    const controls = document.querySelector("OrbitControls");
    if (controls) {
      (controls as any).start();
    }
  }, []);

  const handleLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && <GlobalLoader overlay={false} />}
      <Canvas
        className={className}
        shadows
        camera={camera}
        gl={{ preserveDrawingBuffer: true }}
        style={{ opacity: isLoading ? 0 : 1, transition: 'none' }}>
        <Suspense fallback={null}>
          <AspectRatioController />
          <Monkey isMobile={isMobile} lightPosition={[0, 0, 10]} hovered={hovered} onLoaded={handleLoaded} />
          {/* <AsciiRenderer fgColor="white" bgColor="transparent" characters=" ■■■*+=-:." resolution={0.25} invert={false} /> */}
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default MonkeyCanvas;
