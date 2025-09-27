import React from "react";

interface GradientBarsProps {
  bars?: number;
  colors?: string[];
}

export const GradientBars = ({
  bars = 20,
  colors = ["#778da9D9", "#415a77CC", "transparent"],
}: GradientBarsProps) => {
  const gradientStyle = `linear-gradient(to top, ${colors.join(", ")})`;

  return (
    <div
      style={{
        position: "absolute",
        inset: "0",
        zIndex: "2",
        overflow: "hidden",
        opacity: "0.4",
      }}
    >
      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        {Array.from({ length: bars }).map((_, index) => {
          const position = index / (bars - 1);
          const center = 0.5;
          const distance = Math.abs(position - center);
          const scale = 0.3 + 0.7 * Math.pow(distance * 2, 1.2);

          return (
            <div
              key={`bg-bar-${index}`}
              style={{
                flex: "1",
                transformOrigin: "bottom",
                background: gradientStyle,
                transform: `scaleY(${scale})`,
                animation: `barPulse 3s ease-in-out infinite`,
                animationDelay: `${index * 0.1}s`,
                animationDirection: index % 2 === 0 ? "normal" : "reverse",
              }}
            />
          );
        })}
      </div>

      {/* CSS Animation for bars */}
      <style>{`
        @keyframes barPulse {
          0%, 100% { 
            transform: scaleY(var(--initial-scale, 0.5)); 
            opacity: 1; 
          }
          50% { 
            transform: scaleY(calc(var(--initial-scale, 0.5) + 0.2)); 
            opacity: 0.95; 
          }
        }
      `}</style>
    </div>
  );
};
