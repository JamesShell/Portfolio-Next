import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ShineEffect from "./shine-effect";
import { nyght } from "@/assets/font";

// Define prop types
interface DoubleOutlinedCardProps {
  showHeader?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  onClick?: () => {};
}

// Use React.FC for functional components
const DoubleOutlinedCard: React.FC<DoubleOutlinedCardProps> = ({
  showHeader = true,
  children,
  className,
  contentClassName,
  onClick
}) => {
  return (
    <Card onClick={onClick} className={cn("relative main-card bg-background/30 backdrop-blur-xl border border-border/30 h-[600px] mx-auto rounded-3xl shadow-2xl shadow-background/20 p-2", className)}>
      <ShineEffect />
      {showHeader && (
        <div className="relative main-header w-full flex flex-col items-center justify-center rounded-t-2xl bg-background/40 backdrop-blur-md border border-x-border/30 border-t-border/50 h-12 shadow-lg bg-muted/30">
          {/* Laptop Camera Indicator (visible on larger screens) */}
          <div className="hidden lg:block">
            <div className="w-6 h-6 bg-background border rounded-sm relative flex">
              <div className="w-2 h-2 bg-muted rounded-full m-auto"></div>
            </div>
          </div>

          {/* Phone Display Feature (visible on smaller screens) */}
          <div className="block lg:hidden">
            <div className="w-10 h-2 bg-background border rounded-lg relative"></div>
          </div>
        </div>
      )}
      <CardContent className={cn(
        `${!showHeader && 'main-card border-t-border/30 rounded-2xl'} w-full h-full flex flex-col items-start gap-6 p-10 rounded-b-2xl border border-x-border/30 border-b-border/30 bg-background/20 backdrop-blur-sm`,
        contentClassName
      )}>
        {children}
      </CardContent>
      {showHeader && (<h1 className={`z-20 scale-105 italic text-7xl md:text-9xl font-regular bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent tracking-wide fixed -bottom-16 left-1/2 transform -translate-x-1/2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${nyght.className}`}>
              Ettouzany
            </h1>)}
    </Card>
  );
};

export default DoubleOutlinedCard;
