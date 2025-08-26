
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

// Magnetic Button Component
const MagneticButton: React.FC<{
  children: React.ReactNode;
  href: string;
  className?: string;
}> = ({ children, href, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const angle = useMotionValue(0); // 🔥 new

  const springConfig = { damping: 15, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springAngle = useSpring(angle, { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Magnetic pull
    x.set(distanceX * 0.1);
    y.set(distanceY * 0.1);

    // 🔥 Calculate angle for arrow rotation
    const rad = Math.atan2(distanceY, distanceX); // in radians
    const deg = rad * (180 / Math.PI); // convert to degrees
    angle.set(deg + 45); // offset to point arrow correctly
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    angle.set(0); // reset arrow angle
  };

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        x: springX,
        y: springY,
      }}
    >
      <Link href={href} className="inline-block">
        <motion.div
          className={`group relative bg-foreground text-background pl-6 pr-2 py-2 rounded-full font-medium transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
          whileHover={{ scale: 1.02 }}
        >
          <span className="flex items-center gap-4 relative z-10">
            {children}
            <motion.div
              className="h-10 aspect-square bg-background text-foreground rounded-full flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300"
              style={{
                rotate: springAngle,
                scale: 1.1,
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </span>

          {/* Hover effect */}
          <motion.div
            className="absolute inset-0 bg-foreground/90"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ borderRadius: "50px" }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default MagneticButton;