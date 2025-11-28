import * as React from "react";
import { cn } from "@/lib/utils";

const IndustrialCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}
    {...props}
  />
));
IndustrialCard.displayName = "IndustrialCard";

const IndustrialCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
IndustrialCardHeader.displayName = "IndustrialCardHeader";

const IndustrialCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
IndustrialCardTitle.displayName = "IndustrialCardTitle";

const IndustrialCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
IndustrialCardDescription.displayName = "IndustrialCardDescription";

const IndustrialCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
IndustrialCardContent.displayName = "IndustrialCardContent";

const IndustrialCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
IndustrialCardFooter.displayName = "IndustrialCardFooter";

export {
  IndustrialCard,
  IndustrialCardHeader,
  IndustrialCardFooter,
  IndustrialCardTitle,
  IndustrialCardDescription,
  IndustrialCardContent,
};
