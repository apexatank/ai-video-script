"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = (event: React.MouseEvent) => {
    // Capture the click position for the expansion effect
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      setMousePos({ x: event.clientX, y: event.clientY });
    }

    setIsTransitioning(true);
    
    // Switch theme after transition is well underway
    setTimeout(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }, 400);

    // End transition after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[10000]">
        <motion.button
          ref={buttonRef}
          onClick={toggleTheme}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative w-16 h-16 rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all border",
            "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
            "text-zinc-900 dark:text-zinc-100 group overflow-hidden"
          )}
          aria-label="Toggle theme"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative w-7 h-7">
            <motion.div
              initial={false}
              animate={{
                rotate: resolvedTheme === "dark" ? 0 : 90,
                scale: resolvedTheme === "dark" ? 1 : 0,
                opacity: resolvedTheme === "dark" ? 1 : 0,
              }}
              transition={{ duration: 0.4, ease: "backOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="w-7 h-7 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{
                rotate: resolvedTheme === "dark" ? -90 : 0,
                scale: resolvedTheme === "dark" ? 0 : 1,
                opacity: resolvedTheme === "dark" ? 0 : 1,
              }}
              transition={{ duration: 0.4, ease: "backOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="w-7 h-7 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </motion.div>
          </div>
        </motion.button>
      </div>

      {/* Expansion Effect Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ 
              clipPath: `circle(0% at ${mousePos.x}px ${mousePos.y}px)`,
            }}
            animate={{ 
              clipPath: `circle(150% at ${mousePos.x}px ${mousePos.y}px)`,
            }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.5, ease: "easeInOut" }
            }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className={cn(
              "fixed inset-0 z-[9999] pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]",
              resolvedTheme === "dark" ? "bg-[#fafafa]" : "bg-[#09090b]"
            )}
          />
        )}
      </AnimatePresence>
    </>
  );
}
