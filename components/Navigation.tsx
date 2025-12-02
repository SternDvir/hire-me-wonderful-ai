"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Upload, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/results", label: "Results", icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 h-14 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-h3 font-semibold text-text-primary hover:text-accent transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-accent/90 flex items-center justify-center shadow-glow">
            <span className="text-white text-small font-bold">H</span>
          </div>
          <span className="hidden sm:inline">Hire Me</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-body transition-all duration-150",
                  active
                    ? "bg-background-tertiary text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-tertiary/50"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4",
                  active && "text-accent"
                )} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
