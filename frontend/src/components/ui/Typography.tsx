import type { ElementType, HTMLAttributes, ReactNode } from "react";

type TypographyVariant =
  | "display"
  | "title"
  | "heading"
  | "section"
  | "subsection"
  | "card-title"
  | "lead"
  | "body"
  | "body-sm"
  | "body-muted"
  | "label"
  | "caption"
  | "error"
  | "none";

interface TypographyProps extends Omit<HTMLAttributes<HTMLElement>, "as"> {
  as?: ElementType;
  variant?: TypographyVariant;
  children: ReactNode;
}

const variantClasses: Record<TypographyVariant, string> = {
  display: "text-balance text-4xl font-semibold tracking-tight sm:text-5xl",
  title: "text-balance text-2xl font-semibold tracking-tight",
  heading: "text-xl font-semibold",
  section: "text-lg font-semibold",
  subsection: "text-base font-semibold",
  "card-title": "font-medium",
  lead: "text-zinc-600 dark:text-zinc-400",
  body: "text-zinc-700 dark:text-zinc-300",
  "body-sm": "text-sm text-zinc-700 dark:text-zinc-300",
  "body-muted": "text-sm text-zinc-600 dark:text-zinc-400",
  label: "text-sm font-medium",
  caption: "text-xs text-zinc-500",
  error: "text-sm text-red-700 dark:text-red-400",
  none: "",
};

const defaultTag: Record<TypographyVariant, ElementType> = {
  display: "h1",
  title: "h1",
  heading: "h1",
  section: "h2",
  subsection: "h2",
  "card-title": "h2",
  lead: "p",
  body: "p",
  "body-sm": "p",
  "body-muted": "p",
  label: "span",
  caption: "span",
  error: "p",
  none: "p",
};

export function Typography({
  as,
  variant = "body",
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as ?? defaultTag[variant];
  const classes = `${variantClasses[variant]}${className ? ` ${className}` : ""}`;

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
