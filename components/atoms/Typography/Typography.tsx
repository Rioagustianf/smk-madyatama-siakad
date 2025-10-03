import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
      h2: "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
      h3: "text-2xl md:text-3xl font-semibold tracking-tight",
      h4: "text-xl md:text-2xl font-semibold tracking-tight",
      h5: "text-lg md:text-xl font-medium tracking-tight",
      h6: "text-base md:text-lg font-medium tracking-tight",
      body1: "text-base leading-relaxed",
      body2: "text-sm leading-relaxed",
      subtitle1: "text-lg font-medium",
      subtitle2: "text-base font-medium",
      caption: "text-xs text-muted-foreground",
      overline: "text-xs font-medium uppercase tracking-wider",
    },
    color: {
      default: "text-foreground",
      primary: "text-primary-600",
      secondary: "text-secondary-600",
      muted: "text-muted-foreground",
      accent: "text-accent-600",
      white: "text-white",
      gradient: "gradient-text",
    },
  },
  defaultVariants: {
    variant: "body1",
    color: "default",
  },
});

type TypographyVariantProps = VariantProps<typeof typographyVariants>;

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    TypographyVariantProps {
  as?: keyof JSX.IntrinsicElements;
  gradient?: boolean;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, color, as, children, ...props }, ref) => {
    const Component = as || getDefaultComponent(variant);

    return React.createElement(
      Component,
      {
        className: cn(typographyVariants({ variant, color, className })),
        ref,
        ...props,
      },
      children
    );
  }
);

function getDefaultComponent(
  variant: TypographyProps["variant"]
): keyof JSX.IntrinsicElements {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "subtitle1":
    case "subtitle2":
      return "h6";
    case "caption":
    case "overline":
      return "span";
    default:
      return "p";
  }
}

Typography.displayName = "Typography";

export { Typography, typographyVariants };
