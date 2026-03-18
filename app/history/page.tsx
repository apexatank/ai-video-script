
"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getHistoryAsync, deleteFromHistoryAsync, toggleBookmarkAsync, ScriptItem } from "@/lib/history-utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Youtube, 
  Calendar,
  MessageSquare,
  History as HistoryIcon,
  Bookmark,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function HistoryPage() {
  const [history, setHistory] = useState<ScriptItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getHistoryAsync();
        setHistory(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteFromHistoryAsync(id);
    const updated = await getHistoryAsync();
    setHistory(updated);
  };

  const handleToggleBookmark = async (id: string, currentStatus: boolean | undefined) => {
    await toggleBookmarkAsync(id, !!currentStatus);
    const updated = await getHistoryAsync();
    setHistory(updated);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHistory = history.filter(item => 
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.youtubeUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <PageHeader 
          title="Generation History"
          description="Manage and review your previously generated scripts."
          icon={HistoryIcon}
          iconColor="text-indigo-500"
        />

        <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border border-border shadow-sm">
          <div className="relative flex-1 px-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by topic or URL..." 
              className="pl-10 border-0 focus-visible:ring-0 shadow-none bg-transparent text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {filteredHistory.length} Results
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border">
            <Loader2 className="text-primary animate-spin mb-4" size={40} />
            <p className="text-muted-foreground font-medium animate-pulse">Fetching your history...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="text-muted" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No scripts found</h3>
              <p className="text-muted-foreground mt-1">Generate some scripts to see them here.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none hover:bg-primary/20 transition-colors capitalize">
                          {item.style}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground pt-1 group-hover:text-primary transition-colors">
                        {item.topic || "Untitled Script"}
                      </CardTitle>
                    </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(
                            "rounded-xl transition-colors",
                            item.isBookmarked ? "text-amber-500 bg-amber-500/10" : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                          )}
                          onClick={() => handleToggleBookmark(item.id, item.isBookmarked)}
                        >
                          <Bookmark size={18} fill={item.isBookmarked ? "currentColor" : "none"} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.youtubeUrl && (
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-xl border border-border group/link">
                      <Youtube className="text-red-600" size={18} />
                      <a 
                        href={item.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground/80 truncate flex-1 hover:text-primary transition-colors"
                      >
                        {item.youtubeUrl}
                      </a>
                      <ExternalLink size={14} className="text-muted group-hover/link:text-primary transition-colors" />
                    </div>
                  )}

                  <div className="bg-neutral-950 rounded-2xl p-6 relative group/code">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono uppercase tracking-widest">
                        <MessageSquare size={14} />
                        Script Output
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 text-neutral-400 hover:text-white hover:bg-white/10"
                        onClick={() => copyToClipboard(item.script, item.id)}
                      >
                        {copiedId === item.id ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                        <span className="ml-2 text-xs">{copiedId === item.id ? "Copied" : "Copy"}</span>
                      </Button>
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {item.script}
                      </ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        )}
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </AppLayout>
  );
}
