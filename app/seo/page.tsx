"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Copy, Check, Search, Hash, Layout, Type, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SEOAssistantPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generateSEO = async () => {
    if (!input) return;
    
    try {
      setLoading(true);
      const res = await fetch("/api/seo-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: input }),
      });
      
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <PageHeader 
          title="SEO Assistant"
          description="Generate viral titles, descriptions, and tags for your video."
          icon={Search}
          iconColor="text-blue-500"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="border border-border shadow-xl bg-card rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/30 p-8">
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                Your Script or Concept
                <FileText className="text-muted-foreground" size={18} />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground">Paste your script here</Label>
                <Textarea
                  placeholder="Paste the script you just generated or write your video concept..."
                  className="min-h-[400px] bg-accent/50 border-border focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm rounded-xl resize-none p-4"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <Button
                onClick={generateSEO}
                disabled={loading || !input}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Analyzing SEO...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Generate SEO Bundle
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {!result && !loading && (
              <div className="h-[600px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-muted/30">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No SEO data yet</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
                  Paste your script on the left and click generate to see AI-optimized metadata.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-[600px] border border-border rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-card shadow-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={24} />
                  </div>
                  <p className="font-bold text-foreground">AI is thinking...</p>
                  <p className="text-sm text-muted-foreground">Checking keywords and viral trends</p>
                </div>
              </div>
            )}

            {result && !loading && (
              <Card className="border border-primary/20 shadow-xl bg-card rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <CardHeader className="border-b border-primary/10 bg-primary/2 p-6 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
                    SEO Recommendations
                    <Sparkles className="text-amber-400" size={18} />
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-2 text-xs font-bold"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <><Check className="text-emerald-500" size={16} /> Copied</>
                    ) : (
                      <><Copy size={16} /> Copy All</>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[600px] overflow-auto p-8 scrollbar-thin scrollbar-thumb-primary/10">
                    <div className="prose prose-neutral max-w-none dark:prose-invert">
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result}
                       </ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
