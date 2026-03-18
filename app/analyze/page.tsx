"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Gauge, Sparkles, FileText, CheckCircle2, AlertCircle, Lightbulb, Loader2, BarChart3, TrendingUp, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  overallScore: number;
  metrics: { name: string; score: number; feedback: string }[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function AnalyzePage() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!script) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, topic }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.analysis);
      }
    } catch (error) {
      console.error("Failed to analyze script:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        <PageHeader 
          title="Script Score Analyzer"
          description="Get professional-grade feedback on your script's structure, pacing, and viral potential."
          icon={Gauge}
          iconColor="text-emerald-500"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Editor Section */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            <Card className="rounded-[32px] border border-border shadow-xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/30 border-b border-border p-8">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-200">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-foreground">Script Editor</CardTitle>
                    <CardDescription>Paste your script below to receive an instant performance score.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-sm font-bold text-muted-foreground">Video Topic (Context)</Label>
                  <Input 
                    id="topic"
                    placeholder="e.g., How AI is changing the world"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="rounded-xl h-12 bg-accent/50 border-border focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="content" className="text-sm font-bold text-muted-foreground">Script Content</Label>
                  <Textarea 
                    id="content"
                    placeholder="Paste your full script here..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="min-h-[400px] rounded-[32px] bg-accent/50 border-border focus:bg-background transition-all resize-none p-8 text-lg leading-relaxed font-sans scrollbar-thin scrollbar-thumb-border"
                  />
                </div>
                <Button 
                  onClick={handleAnalyze}
                  disabled={isLoading || !script}
                  className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Analyzing Performance...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2" size={20} />
                      Calculate Script Score
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[500px] bg-muted/30 rounded-[40px] border-2 border-dashed border-border flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-20 h-20 bg-card rounded-3xl shadow-sm border border-border flex items-center justify-center mb-6">
                    <BarChart3 className="text-muted-foreground/30" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Awaiting Script</h3>
                  <p className="text-muted-foreground max-w-[250px] mt-2">Submit your script to see a detailed breakdown of its potential.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Overall Score Card */}
                  <Card className="rounded-[32px] border border-border shadow-2xl bg-card overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                    <CardHeader className="p-8 text-center pb-0 relative z-10">
                      <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Overall Vitality Score</span>
                      <div className="relative inline-flex items-center justify-center">
                         <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="58"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-muted/30"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="58"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={364}
                              strokeDashoffset={364 - (364 * result.overallScore) / 100}
                              className="text-emerald-500 transition-all duration-1000 ease-out"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-4xl font-black text-foreground">{result.overallScore}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 relative z-10">
                       <div className="grid grid-cols-2 gap-4">
                          {result.metrics.map((m, idx) => (
                            <div key={idx} className="bg-accent/50 rounded-2xl p-4 border border-border">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">{m.name}</span>
                                <div className="flex items-center justify-between">
                                   <span className="text-xl font-black text-foreground">{m.score}%</span>
                                   <div className={cn(
                                     "w-2 h-2 rounded-full",
                                     m.score > 80 ? "bg-emerald-500" : m.score > 50 ? "bg-amber-500" : "bg-rose-500"
                                   )} />
                                </div>
                            </div>
                          ))}
                       </div>
                    </CardContent>
                  </Card>

                  {/* Highlights Card */}
                  <Card className="rounded-[32px] border border-border shadow-sm bg-card overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                       <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                          <TrendingUp className="text-emerald-500" size={20} />
                          Analysis Highlights
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Strengths</h4>
                          <div className="space-y-2">
                            {result.strengths.map((s, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                <span className="text-sm font-medium text-foreground">{s}</span>
                              </div>
                            ))}
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Areas for growth</h4>
                          <div className="space-y-2">
                            {result.weaknesses.map((w, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                                <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />
                                <span className="text-sm font-medium text-foreground">{w}</span>
                              </div>
                            ))}
                          </div>
                       </div>
                    </CardContent>
                  </Card>

                  {/* Improvement Tips */}
                  <Card className="rounded-[32px] border-none shadow-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white overflow-hidden group">
                     <CardHeader className="p-8">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-white/20 rounded-xl">
                              <Lightbulb className="text-white" size={20} />
                           </div>
                           <CardTitle className="text-xl font-bold">Pro Optimization Tips</CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent className="p-8 pt-0 space-y-4">
                        {result.suggestions.map((s, i) => (
                          <div key={i} className="flex items-start gap-3 group/tip">
                             <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0 group-hover/tip:scale-150 transition-transform" />
                             <p className="text-sm font-medium text-emerald-50 leading-relaxed">{s}</p>
                          </div>
                        ))}
                     </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
