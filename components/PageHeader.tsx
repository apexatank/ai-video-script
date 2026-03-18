
"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  badge?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, iconColor, badge }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground flex items-center gap-3 tracking-tight">
          {title} 
          {Icon && (
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className={iconColor || "text-primary"} size={28} />
            </motion.div>
          )}
        </h1>
        <p className="text-muted-foreground font-medium">{description}</p>
      </div>
      {badge && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="shrink-0"
        >
          {badge}
        </motion.div>
      )}
    </div>
  );
}
