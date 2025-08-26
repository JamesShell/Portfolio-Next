import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "relative inline-flex items-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-muted/50 text-foreground border border-border/20 shadow-sm hover:bg-muted hover:border-border/40 hover:shadow-lg before:absolute before:inset-x-0 before:h-[1.5px] before:w-1/2 before:mx-auto before:-top-px before:shadow-xl before:bg-gradient-to-r before:from-transparent before:via-foreground/50 before:to-transparent",
        success:
          "bg-emerald-500/20 text-emerald-500-foreground border border-emerald-500/20 shadow-sm hover:bg-emerald-500/50 before:absolute before:inset-x-0 before:h-[1.5px] before:w-1/2 before:mx-auto before:-top-px before:shadow-xl before:bg-gradient-to-r before:from-transparent before:via-emerald-500 before:to-transparent",
          secondary:
          "bg-secondary/40 text-secondary-foreground border border-secondary/20 shadow-sm hover:bg-secondary/50 before:absolute before:inset-x-0 before:h-[1.5px] before:w-1/2 before:mx-auto before:-top-px before:shadow-xl before:bg-gradient-to-r before:from-transparent before:via-secondary before:to-transparent",
        destructive:
          "bg-destructive/40 text-destructive-foreground border border-destructive/20 shadow-sm hover:bg-destructive/50 before:absolute before:inset-x-0 before:h-[1.5px] before:w-1/2 before:mx-auto before:-top-px before:shadow-xl before:bg-gradient-to-r before:from-transparent before:via-destructive before:to-transparent",
        warning:
          "bg-yellow-400/20 text-yellow-400-foreground border border-yellow-400/20 shadow-sm hover:bg-yellow-400/50 before:absolute before:inset-x-0 before:h-[1.5px] before:w-1/2 before:mx-auto before:-top-px before:shadow-xl before:bg-gradient-to-r before:from-transparent before:via-yellow-400 before:to-transparent",
        outline: "bg-background/40 text-foreground border border-input/20 shadow-sm hover:bg-accent/40 before:absolute before:inset-x-0 before:h-[1.5px] before:w-1/2 before:mx-auto before:-top-px before:shadow-xl before:bg-gradient-to-r before:from-transparent before:via-accent before:to-transparent",
      },
      size: {
        sm: "px-3 py-1 text-xs",
        default: "px-4 py-1.5 text-sm",
        lg: "px-5 py-2 text-base",
        xl: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
