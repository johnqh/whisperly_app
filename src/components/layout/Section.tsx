import React from "react";

const spacingClasses = {
  none: "",
  xs: "py-2",
  sm: "py-3",
  md: "py-4",
  lg: "py-6",
  xl: "py-8",
  "2xl": "py-12",
  "3xl": "py-16",
  "4xl": "py-20",
  "5xl": "py-24",
} as const;

const backgroundClasses = {
  none: "bg-transparent",
  default: "bg-gray-50 dark:bg-gray-900",
  surface: "bg-white dark:bg-gray-800",
  gradient:
    "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/50 dark:to-purple-900/50",
  "gradient-primary":
    "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50",
  "gradient-secondary":
    "bg-gradient-to-br from-green-50 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50",
  "gradient-tertiary":
    "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900",
  "gradient-vibrant":
    "bg-gradient-to-br from-blue-800 to-purple-800 dark:from-blue-900 dark:to-purple-900",
  "gradient-hero":
    "bg-gradient-to-b from-primary/5 to-background",
} as const;

const variantClasses = {
  default: "",
  hero: "relative overflow-hidden",
  feature: "bg-white dark:bg-gray-800",
  cta: "relative overflow-hidden",
  testimonial: "bg-gray-50 dark:bg-gray-900",
  footer: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-t",
} as const;

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
} as const;

type Spacing = keyof typeof spacingClasses;
type Background = keyof typeof backgroundClasses;
type Variant = keyof typeof variantClasses;
type MaxWidth = keyof typeof maxWidthClasses;

interface SectionProps {
  children: React.ReactNode;
  spacing?: Spacing;
  background?: Background;
  variant?: Variant;
  maxWidth?: MaxWidth;
  className?: string;
  containerClassName?: string;
  as?: keyof React.JSX.IntrinsicElements;
  id?: string;
  fullWidth?: boolean;
}

export function Section({
  children,
  spacing = "3xl",
  background = "none",
  variant = "default",
  maxWidth = "7xl",
  className = "",
  containerClassName = "",
  as: Component = "section",
  id,
  fullWidth = false,
}: SectionProps) {
  const sectionClasses = [
    spacingClasses[spacing],
    backgroundClasses[background],
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = fullWidth ? (
    children
  ) : (
    <div
      className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}
    >
      {children}
    </div>
  );

  return React.createElement(
    Component,
    {
      id,
      className: sectionClasses,
    },
    content
  );
}

export default Section;
