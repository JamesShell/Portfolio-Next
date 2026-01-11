import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 backdrop-blur-sm overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary/80 text-primary-foreground border border-primary/20 shadow hover:bg-primary/100 before:absolute before:inset-x-0 before:h-px before:w-1/2 before:mx-auto before:-top-px before:shadow-2xl before:bg-gradient-to-r before:from-transparent before:via-primary before:to-transparent",
        destructive:
          "bg-destructive/40 text-destructive-foreground border border-destructive/20 shadow hover:bg-destructive/50 before:absolute before:inset-x-0 before:h-px before:w-1/2 before:mx-auto before:-top-px before:shadow-2xl before:bg-gradient-to-r before:from-transparent before:via-destructive before:to-transparent",
        outline:
          "bg-background/40 text-foreground border border-input/20 shadow hover:bg-accent/40 before:absolute before:inset-x-0 before:h-px before:w-1/2 before:mx-auto before:-top-px before:shadow-2xl before:bg-gradient-to-r before:from-transparent before:via-accent before:to-transparent",
        secondary:
          "bg-secondary/40 text-secondary-foreground border border-secondary/20 shadow hover:bg-secondary/50 before:absolute before:inset-x-0 before:h-px before:w-1/2 before:mx-auto before:-top-px before:shadow-2xl before:bg-gradient-to-r before:from-transparent before:via-secondary before:to-transparent",
        ghost: "bg-transparent hover:bg-accent/40 border border-transparent before:absolute before:inset-x-0 before:h-px before:w-1/2 before:mx-auto before:-top-px before:shadow-2xl before:bg-gradient-to-r before:from-transparent before:via-accent before:to-transparent before:opacity-0 hover:before:opacity-100",
        link: "text-primary underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
