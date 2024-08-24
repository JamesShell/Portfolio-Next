import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ShineEffect from "./shine-effect";

// Define prop types
interface DoubleOutlinedCardProps {
  showHeader?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

// Use React.FC for functional components
const DoubleOutlinedCard: React.FC<DoubleOutlinedCardProps> = ({
  showHeader = true,
  children,
  className,
  contentClassName,
}) => {
  return (
    <Card className={cn("relative main-card bg-muted/50 h-[600px] mx-auto rounded-3xl shadow-lg p-2", className)}>
      <ShineEffect />
      {showHeader && (
        <div className="relative main-header w-full flex flex-col items-center justify-center rounded-t-2xl bg-shiny-header border border-x-foreground/20 border-t-foreground/40 h-10 shadow-md bg-muted/50">
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
        `${!showHeader && 'main-card border-t-foreground/20 rounded-2xl'} w-full h-full flex flex-col items-start gap-5 p-8 rounded-b-2xl border border-x-foreground/20 border-b-foreground/20`,
        contentClassName
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DoubleOutlinedCard;
