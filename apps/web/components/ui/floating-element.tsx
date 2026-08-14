"use client";

import React from "react";

interface FloatingElementProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  duration?: number; // duration in seconds (default 4)
  delay?: number; // delay in seconds (default 0)
  distance?: number; // float vertical distance in px (default 12)
  rotateAngle?: number; // subtle rotation angle in deg (default 2)
}

export function FloatingElement({
  children,
  className = "",
  duration = 4,
  delay = 0,
  distance = 12,
  rotateAngle = 2,
  style,
  ...props
}: FloatingElementProps) {
  return (
    <div
      className={`will-change-transform ${className}`}
      style={{
        animationName: "customFloatingBob",
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
