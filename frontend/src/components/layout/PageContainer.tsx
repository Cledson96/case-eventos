import type { ReactNode } from "react";

const sizeClass = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
} as const;

type PageContainerProps = {
  children: ReactNode;
  size?: keyof typeof sizeClass;
  className?: string;
};

export function PageContainer({ children, size = "lg", className }: PageContainerProps) {
  return (
    <main className={`mx-auto w-full px-6 ${sizeClass[size]}${className ? ` ${className}` : ""}`}>
      {children}
    </main>
  );
}
