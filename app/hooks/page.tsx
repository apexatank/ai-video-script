"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Anchor, Sparkles, Wand2, Copy, Check, Lightbulb, Target, MessageSquare, Loader2, PlayCircle, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface HookIdea {
  type: string;
  content: string;
  strategy: string;
}

export default function HooksPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("General Public");
  const [length, setLength] = useState("Medium (~10-15 mins)");
  const [isLoading, setIsLoading] = useState(false);
  const [hooks, setHooks] = useState<HookIdea[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const audienceOptions = ["Beginners", "Experts", "General Public", "Content Creators", "Students"];
  const lengthOptions = ["Short (~5 mins)", "Medium (~10-15 mins)", "Long (20+ mins)"];

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, length }),
      });
      const data = await response.json();
      if (data.success) {
        setHooks(data.hooks);
      }
    } catch (error) {
      console.error("Failed to generate hooks:", error);
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
          title="Hook Generator"
          description="Capture your viewer's attention in the first 10 seconds with high-retention video openings."
          icon={Anchor}
          iconColor="text-indigo-500"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[32px] border border-border shadow-sm overflow-hidden sticky top-24 bg-card">
              <CardHeader className="bg-muted/30 border-b border-border p-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Wand2 size={20} className="text-primary" />
                  Hook Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-sm font-bold text-muted-foreground font-medium">Video Topic</Label>
                  <Input 
                    id="topic"
                    placeholder="e.g., The Future of AI in 2024"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="rounded-xl h-12 bg-accent/50 border-border focus:bg-background transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="audience" className="text-sm font-bold text-muted-foreground font-medium flex items-center gap-2">
                    <Users size={14} className="text-blue-500" />
                    Target Audience
                  </Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger className="rounded-xl h-12 bg-accent/50 border-border">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {audienceOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="length" className="text-sm font-bold text-muted-foreground font-medium flex items-center gap-2">
                    <Clock size={14} className="text-emerald-500" />
                    Video Length
                  </Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger className="rounded-xl h-12 bg-accent/50 border-border">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      {lengthOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={isLoading || !topic}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Forging Hooks...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={20} />
                      Generate Hooks
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {hooks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center bg-card rounded-[40px] border border-dashed border-border p-12 text-center"
                >
                  <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare className="text-muted-foreground/30" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Hook your audience</h3>
                  <p className="text-muted-foreground max-w-sm mt-2">Generate scientifically designed opening lines that improve your average view duration (AVD).</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                   {hooks.map((hook, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="rounded-[32px] border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden bg-card">
                        <CardHeader className="p-8 pb-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-wider">
                                  {hook.type}
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                  Option {index + 1}
                                </span>
                              </div>
                              <CardTitle className="text-xl font-bold text-foreground">
                                The First 30 Seconds
                              </CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-2xl h-12 w-12 bg-accent hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                              onClick={() => copyToClipboard(hook.content, index)}
                            >
                              {copiedIndex === index ? <Check size={20} /> : <Copy size={20} />}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                          <div className="relative group/content">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/30 rounded-full group-hover/content:bg-indigo-500 transition-colors" />
                            <p className="text-lg font-medium text-foreground leading-relaxed italic">
                              "{hook.content}"
                            </p>
                          </div>

                          <div className="p-6 bg-emerald-500/10 rounded-[28px] border border-emerald-500/20 flex items-start gap-4">
                            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 shrink-0">
                              <Target size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1 block">Why it anchors viewers</span>
                                <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                                  {hook.strategy}
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
