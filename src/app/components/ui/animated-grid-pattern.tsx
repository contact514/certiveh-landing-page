"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
  hoverRadius?: number;
}

interface Spark {
  cx: number;
  cy: number;
  opacity: number;
  id: number;
}

let sparkId = 0;

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  hoverRadius = 4,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState(() => generateSquares(numSquares));
  const [mouseCell, setMouseCell] = useState<{ cx: number; cy: number } | null>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const lastCellRef = useRef<string>("");

  function getPos() {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }

  function generateSquares(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
    }));
  }

  const updateSquarePosition = (sqId: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === sqId ? { ...sq, pos: getPos() } : sq,
      ),
    );
  };

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions, numSquares]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = containerRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const newCx = Math.floor(mx / width);
    const newCy = Math.floor(my / height);
    setMouseCell({ cx: newCx, cy: newCy });

    const cellKey = `${newCx}-${newCy}`;
    if (cellKey === lastCellRef.current) return;
    lastCellRef.current = cellKey;

    // Spawn random sparks around the cursor
    const newSparks: Spark[] = [];
    const outerRadius = hoverRadius + 4;
    for (let dx = -outerRadius; dx <= outerRadius; dx++) {
      for (let dy = -outerRadius; dy <= outerRadius; dy++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.5 || dist > outerRadius) continue;
        const chance = dist < hoverRadius ? 0.2 : 0.08;
        if (Math.random() < chance) {
          newSparks.push({
            cx: newCx + dx,
            cy: newCy + dy,
            opacity: 0.3 + Math.random() * 0.6,
            id: sparkId++,
          });
        }
      }
    }

    if (newSparks.length > 0) {
      setSparks((prev) => [...prev, ...newSparks]);
      // Remove these sparks after they fade
      const ids = newSparks.map((s) => s.id);
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => !ids.includes(s.id)));
      }, 400 + Math.random() * 500);
    }
  }, [width, height, hoverRadius]);

  const handleMouseLeave = useCallback(() => {
    setMouseCell(null);
    lastCellRef.current = "";
  }, []);

  const cols = dimensions.width ? Math.ceil(dimensions.width / width) : 0;
  const rows = dimensions.height ? Math.ceil(dimensions.height / height) : 0;

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {/* Radial glow around cursor */}
        {mouseCell && cols > 0 && rows > 0 ? Array.from(
          { length: cols * rows },
          (_, i) => {
            const cellX = i % cols;
            const cellY = Math.floor(i / cols);
            const dx = cellX - mouseCell.cx;
            const dy = cellY - mouseCell.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > hoverRadius) return null;
            const opacity = Math.max(0, 1 - dist / hoverRadius);
            return (
              <rect
                key={`glow-${cellX}-${cellY}`}
                width={width - 1}
                height={height - 1}
                x={cellX * width + 1}
                y={cellY * height + 1}
                fill="currentColor"
                strokeWidth="0"
                opacity={opacity}
                style={{ transition: "opacity 0.15s ease" }}
              />
            );
          }
        ) : null}
        {/* Random sparks */}
        {sparks.map((spark) => (
          <rect
            key={`spark-${spark.id}`}
            width={width - 1}
            height={height - 1}
            x={spark.cx * width + 1}
            y={spark.cy * height + 1}
            fill="currentColor"
            strokeWidth="0"
            opacity={spark.opacity}
            style={{
              animation: "sparkFade 0.6s ease-out forwards",
            }}
          />
        ))}
        {/* Animated squares */}
        {squares.map(({ pos: [x, y], id }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            key={`${x}-${y}-${index}`}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
      <style>{`
        @keyframes sparkFade {
          0% { opacity: var(--spark-opacity, 0.7); }
          100% { opacity: 0; }
        }
      `}</style>
    </svg>
  );
}
