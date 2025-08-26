import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-xl bg-gradient-to-r from-transparent via-primary to-transparent" />
        <input
          type={type}
          className={cn(
            "relative flex h-11 w-full rounded-md bg-background/40 backdrop-blur-sm border border-input/20 px-4 py-2 text-sm shadow transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-background/50 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
