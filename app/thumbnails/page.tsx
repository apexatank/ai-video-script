"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Image as ImageIcon, Sparkles, Wand2, Copy, Check, Lightbulb, Target, Layout, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

interface ThumbnailIdea {
  concept: string;
  visualDescription: string;
  textOverlay: string;
  logic: string;
}

export default function ThumbnailsPage() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<ThumbnailIdea[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-thumbnails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, script }),
      });
      const data = await response.json();
      if (data.success) {
        setIdeas(data.ideas);
      }
    } catch (error) {
      console.error("Failed to generate thumbnails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        <PageHeader 
          title="Thumbnail Idea Generator"
          description="Generate viral thumbnail concepts designed to maximize your click-through rate (CTR)."
          icon={ImageIcon}
          iconColor="text-rose-500"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[32px] border border-border shadow-sm overflow-hidden sticky top-24 bg-card">
              <CardHeader className="bg-muted/30 border-b border-border p-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Wand2 size={20} className="text-primary" />
                  Generation Logic
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-sm font-bold text-foreground">Video Topic</Label>
                  <Input 
                    id="topic"
                    placeholder="e.g., How to build an AI app"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="rounded-xl h-12 bg-accent/50 border-border focus:bg-background transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="script" className="text-sm font-bold text-foreground">Video Script/Notes (Optional)</Label>
                  <Textarea 
                    id="script"
                    placeholder="Paste your script here for more contextual ideas..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="min-h-[150px] rounded-2xl bg-accent/50 border-border focus:bg-background transition-all resize-none p-4"
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={isLoading || !topic}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Designing Ideas...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={20} />
                      Generate Concepts
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {ideas.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center bg-card rounded-[40px] border border-dashed border-border p-12 text-center"
                >
                  <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                    <Lightbulb className="text-muted" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No concepts yet</h3>
                  <p className="text-muted-foreground max-w-sm mt-2">Enter your video topic to generate unique thumbnail ideas optimized for performance.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                   {ideas.map((idea, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="rounded-[32px] border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden bg-card">
                        <div className="bg-gradient-to-r from-primary/5 via-transparent to-transparent h-1 absolute inset-y-0 left-0 w-1" />
                        <CardHeader className="p-8 pb-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                                Idea #{index + 1}
                              </Badge>
                              <CardTitle className="text-2xl font-black text-foreground leading-tight">
                                {idea.concept}
                              </CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-2xl h-12 w-12 bg-accent hover:bg-primary hover:text-white transition-all shadow-sm"
                              onClick={() => copyToClipboard(`Concept: ${idea.concept}\nVisual: ${idea.visualDescription}\nText: ${idea.textOverlay}`, index)}
                            >
                              {copiedIndex === index ? <Check size={20} /> : <Copy size={20} />}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                                <ImageIcon size={16} />
                                Visual Description
                              </div>
                              <p className="text-muted-foreground text-sm leading-relaxed bg-accent/30 p-5 rounded-[24px] border border-border">
                                {idea.visualDescription}
                              </p>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm uppercase tracking-widest">
                                <Layout size={16} />
                                Text Overlay
                              </div>
                              <div className="relative aspect-video bg-neutral-900 rounded-[24px] flex items-center justify-center p-6 overflow-hidden border-4 border-white dark:border-neutral-800 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-primary/20 animate-pulse" />
                                <span className="text-white text-xl sm:text-2xl font-black text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] z-10 leading-tight uppercase italic tracking-tighter transform -rotate-1">
                                  {idea.textOverlay || "No Text"}
                                </span>
                                <div className="absolute bottom-4 right-4 text-[8px] font-bold text-white/40 tracking-[0.3em]">PREVIEW MOCKUP</div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-amber-500/10 rounded-[28px] border border-amber-500/20 flex items-start gap-4">
                            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500 shrink-0">
                              <Target size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1 block">The Logic</span>
                                <p className="text-sm text-amber-500/80 font-medium leading-relaxed">
                                  {idea.logic}
                                </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
