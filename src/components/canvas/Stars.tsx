"use client";

import { useState, useRef, useEffect, Suspense, RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

import { useTheme } from "next-themes";
import { hslToRgb, rgbToHex } from "@/utils/colors";

import * as THREE from "three";

// Type definitions
interface StarsProps extends React.ComponentProps<'group'> {}

const Stars: React.FC<StarsProps> = (props) => {
  const ref = useRef<THREE.Group>(null);
  const [sphere] = useState<Float32Array>(() => (random as any).inSphere(new Float32Array(1000), { radius: 1.2 }));
  const [color, setColor] = useState<string>('#ffffff'); // Default color
  const { theme } = useTheme(); // Access the theme from the context

  useEffect(() => {
    const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim();
    const [h, s, l] = computedColor.match(/\d+/g)?.map(Number) || [0, 0, 0]; // Extract HSL values
    const [r, g, b] = hslToRgb(h, s, l); // Convert HSL to RGB
    const hexColor = rgbToHex(r, g, b); // Convert RGB to HEX
    setColor(hexColor); // Set the color state to the HEX value
  }, [theme]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* @ts-ignore */}
      <Points positions={sphere} stride={3} frustumCulled {...props} ref={ref as any}>
        <PointMaterial
          transparent
          color={color}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas: React.FC = () => {
  return (
    <div className='w-full h-auto absolute inset-0 z-[-1]'>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

// Export the StarsCanvas component and Stars component
export { StarsCanvas, Stars };
