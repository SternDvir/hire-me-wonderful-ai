"use client";

interface GradientOrbsProps {
  variant?: "hero" | "section" | "minimal";
}

export function GradientOrbs({ variant = "section" }: GradientOrbsProps) {
  if (variant === "minimal") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orb-purple rounded-full blur-3xl opacity-40 animate-float" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-orb-pink rounded-full blur-3xl opacity-40 animate-float-slow" />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Large purple orb - top right */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-orb-purple rounded-full blur-3xl opacity-60 animate-float" />

        {/* Large pink orb - bottom left */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-orb-pink rounded-full blur-3xl opacity-60 animate-float-slow" />

        {/* Medium blue orb - center right */}
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-orb-blue rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: "1s" }} />

        {/* Medium orange orb - center left */}
        <div className="absolute top-1/3 -left-20 w-[350px] h-[350px] bg-orb-orange rounded-full blur-3xl opacity-40 animate-float-slow" style={{ animationDelay: "2s" }} />

        {/* Small mixed orb - top center */}
        <div className="absolute top-20 left-1/2 w-[300px] h-[300px] bg-orb-mixed rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: "3s" }} />
      </div>
    );
  }

  // Default "section" variant
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Purple orb - top right */}
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-orb-purple rounded-full blur-3xl opacity-50 animate-float" />

      {/* Pink orb - bottom left */}
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-orb-pink rounded-full blur-3xl opacity-50 animate-float-slow" />

      {/* Blue orb - center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orb-blue rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: "1.5s" }} />
    </div>
  );
}
