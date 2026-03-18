"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Play, Star, BookOpen, Newspaper, Users } from "lucide-react";

const templates = [
  {
    name: "Step-by-Step Tutorial",
    style: "Tutorial",
    topic: "Explain how to... in 5 easy steps.",
    icon: Laptop,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    name: "Product Review",
    style: "Review",
    topic: "A comprehensive review of... covering pros and cons.",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    name: "Educational/History",
    style: "Documentary",
    topic: "The deep dive history of... and why it matters today.",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    name: "Daily Vlog / Story",
    style: "Vlog",
    topic: "A day in the life focusing on... with a personal touch.",
    icon: Play,
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
  {
    name: "News / Commentary",
    style: "News",
    topic: "Breaking down the recent news about... and what it means.",
    icon: Newspaper,
    color: "text-indigo-500",
    bg: "bg-indigo-50"
  },
  {
    name: "Listicle (Top 10)",
    style: "Educational",
    topic: "The ultimate top 10 list of... that you need to know.",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-50"
  }
];

interface TemplatesSectionProps {
  onSelect: (template: { style: string; topic: string }) => void;
}

export default function TemplatesSection({ onSelect }: TemplatesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-black text-foreground tracking-tight">Quick Templates</h2>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary text-primary-foreground rounded-full uppercase">Hot</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, idx) => (
          <Card 
            key={idx} 
            className="group cursor-pointer border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden bg-card"
            onClick={() => onSelect({ style: template.style, topic: template.topic })}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl transition-colors duration-300 ${template.bg} dark:bg-white/5 group-hover:scale-110`}>
                <template.icon size={20} className={template.color} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground truncate">{template.name}</h3>
                <p className="text-[11px] text-muted-foreground font-medium truncate opacity-70">Single-click start</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
