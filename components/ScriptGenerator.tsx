"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getSettingsAsync } from "@/lib/settings-utils";
import { saveToHistoryAsync } from "@/lib/history-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Check, 
  Copy, 
  Loader2, 
  Sparkles, 
  Youtube, 
  Globe, 
  Type, 
  Layout, 
  Zap,
  RotateCcw,
  FileText,
  Search
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ScriptGeneratorProps {
  onScriptGenerated?: (scriptObj: {
    youtubeUrl: string;
    topic: string;
    style: string;
    script: string;
  }) => void;
  preFillStyle?: string;
  preFillTopic?: string;
}

export default function ScriptGenerator({
  onScriptGenerated,
  preFillStyle,
  preFillTopic,
}: ScriptGeneratorProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("");
  const styleOptions = [
    "Educational",
    "Funny",
    "Motivational",
    "Documentary",
    "Vlog",
    "Review",
    "News",
    "Tutorial",
    "Other (custom)",
  ];
  const lengthOptions = ["Short (~5 mins)", "Medium (~10-15 mins)", "Long (20+ mins)"];
  const audienceOptions = ["Beginners", "Experts", "General Public", "Content Creators", "Students"];
  
  const [script, setScript] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [language, setLanguage] = useState("English");
  const [length, setLength] = useState("Medium (~10-15 mins)");
  const [audience, setAudience] = useState("General Public");
  const [errors, setErrors] = useState<{youtubeUrl?: string, topic?: string}>({});

  const languageOptions = [
    "English",
    "Gujarati",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Other (custom)"
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getSettingsAsync();
      if (settings.defaultLanguage) setLanguage(settings.defaultLanguage);
      if (settings.defaultStyle) setStyle(settings.defaultStyle);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (preFillStyle) setStyle(preFillStyle);
    if (preFillTopic) setTopic(preFillTopic);
  }, [preFillStyle, preFillTopic]);

  const validateForm = () => {
    const newErrors: {youtubeUrl?: string, topic?: string} = {};
    
    // YouTube URL Validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeUrl) {
      newErrors.youtubeUrl = "YouTube URL is required";
    } else if (!youtubeRegex.test(youtubeUrl)) {
      newErrors.youtubeUrl = "Please enter a valid YouTube URL";
    }

    // Topic Validation
    if (!topic || topic.trim().length < 5) {
      newErrors.topic = "Topic should be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setCopiedScript(false);
      setCopiedTranscript(false);
      setErrors({});

      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youtubeUrl,
          topic,
          style,
          language,
          length,
          audience
        }),
      });

      const data = await res.json();
      setScript(data.script || "");
      setTranscript(data.transcript || "");
      
      if (data.script) {
        await saveToHistoryAsync({
          youtubeUrl,
          topic: topic || "Generated Script",
          style,
          script: data.script,
          language
        });
        
        if (onScriptGenerated) {
          onScriptGenerated({ youtubeUrl, topic, style, script: data.script });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'script' | 'transcript') => {
    const targetSet = type === 'script' ? setCopiedScript : setCopiedTranscript;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      targetSet(true);
      setTimeout(() => targetSet(false), 2000);
    }
  };

  const resetForm = () => {
    setYoutubeUrl("");
    setTopic("");
    setScript("");
    setTranscript("");
    setErrors({});
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Generator Card */}
      <Card className="overflow-hidden border border-border shadow-xl bg-card rounded-3xl">
        <CardHeader className="border-b border-border bg-muted/30 p-8">
          <div className="flex items-center gap-4">
            <div className="bg-red-500 p-2.5 rounded-2xl shadow-lg shadow-red-200">
              <Youtube className="text-white" size={24} />
            </div>
            <div>
              <CardTitle className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                YouTube AI Script Generator
                <Sparkles
                  className="text-amber-400 animate-pulse"
                  size={18}
                />
              </CardTitle>
              <p className="text-xs text-muted-foreground font-medium mt-1">Transform any video into a fresh, high-quality script.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* URL Input Area */}
          <div className="space-y-3">
            <Label htmlFor="youtube-url" className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
              <Youtube size={16} className="text-red-500" />
              YouTube Video URL
            </Label>
            <div className="relative group">
              <Input
                id="youtube-url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  if (errors.youtubeUrl) setErrors({...errors, youtubeUrl: undefined});
                }}
                className={cn(
                  "pl-4 h-12 bg-accent/50 border-border focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm rounded-xl",
                  errors.youtubeUrl && "border-red-500 focus:ring-red-100 bg-red-50/10"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Layout size={18} />
              </div>
            </div>
            {errors.youtubeUrl && (
              <p className="text-[11px] font-medium text-red-500 mt-1 flex items-center gap-1">
                <RotateCcw className="h-2.5 w-2.5" />
                {errors.youtubeUrl}
              </p>
            )}
          </div>

          {/* Grid Layout for options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="language" className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                <Globe size={16} className="text-blue-500" />
                Output Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="h-11 bg-accent/50 border-border rounded-xl">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="channel-style" className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                <Zap size={16} className="text-amber-500" />
                Channel Style
              </Label>
              <Select value={style} onValueChange={(value) => setStyle(value)}>
                <SelectTrigger id="channel-style" className="h-11 bg-accent/50 border-border rounded-xl">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="length" className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                <FileText size={16} className="text-emerald-500" />
                Script Length
              </Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger id="length" className="h-11 bg-accent/50 border-border rounded-xl">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  {lengthOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="audience" className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                <Search size={16} className="text-purple-500" />
                Target Audience
              </Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience" className="h-11 bg-accent/50 border-border rounded-xl">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audienceOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Topic Input */}
          <div className="space-y-3">
            <Label htmlFor="video-topic" className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
              <Type size={16} className="text-indigo-500" />
              Video Topic & Focus
            </Label>
            <Textarea
              id="video-topic"
              placeholder="What should the AI focus on? (e.g., Explain the core concepts of...)"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (errors.topic) setErrors({...errors, topic: undefined});
              }}
              className={cn(
                "min-h-[100px] bg-accent/50 border-border focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm rounded-xl resize-none p-4",
                errors.topic && "border-red-500 focus:ring-red-100 bg-red-50/10"
              )}
            />
            {errors.topic && (
              <p className="text-[11px] font-medium text-red-500 mt-1">
                {errors.topic}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-6 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  title="Reset form"
                >
                  <RotateCcw size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border-neutral-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">Clear All Fields?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This will reset all your inputs and clear the current transcript and generated script. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="rounded-xl border-border font-medium">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={resetForm}
                    className="rounded-xl bg-primary text-primary-foreground border-none shadow-lg shadow-primary/10 transition-all font-bold"
                  >
                    Yes, Reset Form
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={generate}
              disabled={loading || !youtubeUrl}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Crafting your script...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={20} />
                  Generate AI Script
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {(transcript || script) && (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          {transcript && (
            <Card className="rounded-2xl border border-border shadow-sm overflow-hidden bg-card">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 py-4 px-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600">
                    <Youtube size={16} />
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground">Video Transcript</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-neutral-500 hover:text-primary transition-colors"
                  onClick={() => copyToClipboard(transcript, 'transcript')}
                >
                  {copiedTranscript ? (
                    <><Check className="text-emerald-500" size={14} /> Copied</>
                  ) : (
                    <><Copy size={14} /> Copy</>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[300px] overflow-auto p-6 scrollbar-thin scrollbar-thumb-border">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {transcript}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {script && (
            <Card className="rounded-2xl border border-primary/20 shadow-xl overflow-hidden bg-card">
              <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10 bg-primary/5 py-4 px-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Sparkles size={16} />
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground">AI Generated Script</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs text-neutral-500 hover:text-primary transition-colors"
                    onClick={() => {
                        window.location.href = `/seo?script=${encodeURIComponent(script)}`;
                    }}
                  >
                    <Search size={14} /> Get SEO Tool
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs text-neutral-500 hover:text-primary transition-colors"
                    onClick={() => copyToClipboard(script, 'script')}
                  >
                    {copiedScript ? (
                      <><Check className="text-emerald-500" size={14} /> Copied</>
                    ) : (
                      <><Copy size={14} /> Copy</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="min-h-[400px] max-h-[600px] overflow-auto p-8 scrollbar-thin scrollbar-thumb-primary/10 bg-card">
                  <div className="prose prose-sm prose-neutral max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {script}
                    </ReactMarkdown>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
