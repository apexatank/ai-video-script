"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScriptItem } from "@/lib/history-utils";
import { ScrollText, Bookmark, Zap, Globe } from "lucide-react";

interface DashboardStatsProps {
  scripts: ScriptItem[];
}

export default function DashboardStats({ scripts }: DashboardStatsProps) {
  const totalScripts = scripts.length;
  const totalBookmarks = scripts.filter((s) => s.isBookmarked).length;
  
  // Count unique languages
  const languages = new Set(scripts.map((s) => s.language).filter(Boolean));
  const uniqueLanguages = languages.size;
  
  // Most used style
  const styles = scripts.map((s) => s.style).filter(Boolean);
  const mostUsedStyle = styles.length > 0 
    ? styles.sort((a, b) => 
        styles.filter(v => v === a).length - styles.filter(v => v === b).length
      ).pop()
    : "N/A";

  const stats = [
    {
      label: "Total Scripts",
      value: totalScripts,
      icon: ScrollText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Bookmarks",
      value: totalBookmarks,
      icon: Bookmark,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Languages",
      value: uniqueLanguages,
      icon: Globe,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Primary Style",
      value: mostUsedStyle,
      icon: Zap,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <Card key={idx} className="border border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${stat.bg} dark:bg-white/5`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-xl font-black text-foreground leading-tight">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
