import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-xl bg-gradient-to-r from-transparent via-primary to-transparent" />
        <textarea
          className={cn(
            "relative flex min-h-[80px] w-full rounded-md bg-background/40 backdrop-blur-sm border border-input/20 px-4 py-3 text-sm shadow transition-all duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-background/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
