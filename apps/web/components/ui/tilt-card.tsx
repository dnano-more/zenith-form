"use client";

import React, { useRef, useState, useCallback } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 6)
  perspective?: number; // Perspective distance in px (default 1000)
  scale?: number; // Scale on hover (default 1.01)
  speed?: number; // Transition speed in ms (default 300)
  glare?: boolean; // Enable interactive spotlight glare overlay (default true)
  glareColor?: string; // Custom glare gradient color overlay
  float?: boolean; // Continuous subtle bobbing effect (default false)
  floatDelay?: string; // Delay for float animation
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  perspective = 1000,
  scale = 1.01,
  speed = 300,
  glare = true,
  glareColor = "rgba(255, 255, 255, 0.15)",
  float = false,
  floatDelay = "0s",
  style,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
  const [glareStyle, setGlareStyle] = useState<{ opacity: number; background: string }>({
    opacity: 0,
    background: `radial-gradient(circle at 50% 50%, ${glareColor}, transparent 70%)`,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Mouse position relative to center of element (-0.5 to +0.5)
      const mouseX = (e.clientX - rect.left) / width - 0.5;
      const mouseY = (e.clientY - rect.top) / height - 0.5;

      // Calculate rotation angles (negate mouseY for natural tilt feel)
      const rotateX = -mouseY * maxTilt * 2;
      const rotateY = mouseX * maxTilt * 2;

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
      );

      if (glare) {
        const glareX = ((e.clientX - rect.left) / width) * 100;
        const glareY = ((e.clientY - rect.top) / height) * 100;
        setGlareStyle({
          opacity: 1,
          background: `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, ${glareColor}, transparent 65%)`,
        });
      }
    },
    [maxTilt, perspective, scale, glare, glareColor]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    if (glare) {
      setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transform-gpu transition-transform ease-out rounded-3xl overflow-hidden isolation-auto ${
        float && !isHovered ? "animate-bobbing" : ""
      } ${className}`}
      style={{
        transform,
        transitionDuration: isHovered ? "100ms" : `${speed}ms`,
        animationDelay: floatDelay,
        transformStyle: "preserve-3d",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        ...style,
      }}
      {...props}
    >
      {children}

      {/* Interactive Glare / Reflection Layer */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-20"
          style={{
            opacity: glareStyle.opacity,
            background: glareStyle.background,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}
