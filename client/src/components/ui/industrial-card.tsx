import * as React from "react"
import { cn } from "@/lib/utils"

const IndustrialCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-none border border-border bg-card text-card-foreground shadow-sm relative overflow-hidden",
      "before:absolute before:top-0 before:left-0 before:w-3 before:h-3 before:border-t before:border-l before:border-primary/50 before:content-['']",
      "after:absolute after:bottom-0 after:right-0 after:w-3 after:h-3 after:border-b after:border-r after:border-primary/50 after:content-['']",
      className
    )}
    {...props}
  />
))
IndustrialCard.displayName = "IndustrialCard"

const IndustrialCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-border/40", className)}
    {...props}
  />
))
IndustrialCardHeader.displayName = "IndustrialCardHeader"

const IndustrialCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight font-mono uppercase text-primary/90",
      className
    )}
    {...props}
  />
))
IndustrialCardTitle.displayName = "IndustrialCardTitle"

const IndustrialCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground font-sans", className)}
    {...props}
  />
))
IndustrialCardDescription.displayName = "IndustrialCardDescription"

const IndustrialCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-4", className)} {...props} />
))
IndustrialCardContent.displayName = "IndustrialCardContent"

const IndustrialCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
IndustrialCardFooter.displayName = "IndustrialCardFooter"

export {
  IndustrialCard,
  IndustrialCardHeader,
  IndustrialCardFooter,
  IndustrialCardTitle,
  IndustrialCardDescription,
  IndustrialCardContent,
}
