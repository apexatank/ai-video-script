"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getHistoryAsync, toggleBookmarkAsync, deleteFromHistoryAsync, ScriptItem } from "@/lib/history-utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Youtube, 
  Calendar,
  MessageSquare,
  Bookmark as BookmarkIcon,
  Search,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<ScriptItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      try {
        const allHistory = await getHistoryAsync();
        setBookmarks(allHistory.filter(item => item.isBookmarked));
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleUnbookmark = async (id: string, currentStatus: boolean | undefined) => {
    await toggleBookmarkAsync(id, !!currentStatus);
    const allHistory = await getHistoryAsync();
    setBookmarks(allHistory.filter(item => item.isBookmarked));
  };

  const handleDelete = async (id: string) => {
    await deleteFromHistoryAsync(id);
    const allHistory = await getHistoryAsync();
    setBookmarks(allHistory.filter(item => item.isBookmarked));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredBookmarks = bookmarks.filter(item => 
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.youtubeUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-amber-100 rounded-xl">
              <BookmarkIcon className="text-amber-600" size={24} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Saved Bookmarks</h1>
          </div>
          <p className="text-neutral-500 max-w-2xl">Access your favorite generated scripts and saved video references in one place.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <Input 
              placeholder="Search your bookmarks..." 
              className="pl-11 border-0 focus-visible:ring-0 shadow-none bg-transparent h-11 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden md:block h-8 w-px bg-neutral-200" />
          <div className="px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">
            {filteredBookmarks.length} Saved
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-neutral-200">
              <Loader2 className="text-primary animate-spin mb-4" size={48} />
              <p className="text-neutral-500 font-medium animate-pulse">Loading saved scripts...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
            {filteredBookmarks.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-24 bg-white rounded-[32px] border border-dashed border-neutral-200 shadow-inner"
              >
                <div className="relative inline-block mb-6">
                  <div className="bg-neutral-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <BookmarkIcon className="text-neutral-200" size={40} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                    <div className="bg-amber-100 p-1.5 rounded-full">
                      <BookmarkIcon className="text-amber-500" size={12} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral-900">No bookmarks yet</h3>
                <p className="text-neutral-500 mt-2 max-w-xs mx-auto">Items you bookmark in your history will appear here for quick access.</p>
                <Button 
                  variant="outline" 
                  className="mt-8 rounded-xl border-neutral-200 hover:bg-neutral-50"
                  onClick={() => window.location.href = '/history'}
                >
                  Go to History
                </Button>
              </motion.div>
            ) : (
              filteredBookmarks.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden border-neutral-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group rounded-[24px]">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                              {item.style}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                              <Calendar size={13} />
                              {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold text-neutral-900 pt-2 group-hover:text-amber-600 transition-colors">
                            {item.topic || "Untitled Script"}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-amber-500 bg-amber-50 hover:bg-amber-100 hover:text-amber-600 rounded-xl h-10 w-10 transition-colors"
                            onClick={() => handleUnbookmark(item.id, item.isBookmarked)}
                            title="Remove from bookmarks"
                          >
                            <BookmarkIcon size={20} fill="currentColor" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-10 w-10 transition-colors"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 size={20} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {item.youtubeUrl && (
                        <div className="flex items-center gap-3 p-4 bg-neutral-50/50 rounded-2xl border border-neutral-100 group/link hover:bg-neutral-100/50 transition-colors">
                          <div className="bg-red-50 p-2 rounded-lg">
                            <Youtube className="text-red-600" size={18} />
                          </div>
                          <a 
                            href={item.youtubeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-neutral-700 truncate flex-1 hover:text-primary transition-colors"
                          >
                            {item.youtubeUrl}
                          </a>
                          <ExternalLink size={16} className="text-neutral-300 group-hover/link:text-primary transition-colors" />
                        </div>
                      )}

                      <div className="bg-neutral-900 rounded-[20px] p-6 pt-5 relative group/code overflow-hidden border border-neutral-800 shadow-2xl">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                          <div className="flex items-center gap-2.5 text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Script Content
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-9 px-4 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs"
                            onClick={() => copyToClipboard(item.script, item.id)}
                          >
                            {copiedId === item.id ? (
                              <Check size={14} className="text-green-400 mr-2" />
                            ) : (
                              <Copy size={14} className="mr-2" />
                            )}
                            {copiedId === item.id ? "COPIED" : "COPY SCRIPT"}
                          </Button>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar prose prose-invert prose-sm max-w-none pr-4">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {item.script}
                          </ReactMarkdown>
                        </div>
                        {/* Decorative background glow */}
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
            </AnimatePresence>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid transparent;
          background-clip: content-box;
        }
      `}</style>
    </AppLayout>
  );
}
