"use client";

import React from "react";
import { 
  ExternalLink, 
  Youtube, 
  Calendar, 
  Clock,
  Tag, 
  FileText, 
  MoreHorizontal,
  CheckCircle2,
  Trash2,
  Eye,
  Zap
} from "lucide-react";
import { ScriptItem, deleteFromHistoryAsync } from "@/lib/history-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Separator
} from "@/components/ui/separator";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RecentScriptsTableProps {
  scripts: ScriptItem[];
  onRefresh: () => void;
}

export default function RecentScriptsTable({ scripts, onRefresh }: RecentScriptsTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteFromHistoryAsync(id);
    onRefresh();
  };

  const truncateUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname + parsed.pathname.substring(0, 10) + "...";
    } catch (e) {
      return url.substring(0, 20) + "...";
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="text-xl font-bold text-foreground">Recent Scripts</h3>
        <p className="text-sm text-muted-foreground mt-1">Your recently generated video scripts and transcripts.</p>
      </div>
      
      {/* Mobile Card View (shown on small screens) */}
      <div className="md:hidden divide-y divide-border border-t border-border">
        {scripts.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 text-muted/30" />
              <p>No scripts found yet.</p>
            </div>
          </div>
        ) : (
          scripts.map((script, index) => (
            <div key={script.id} className="p-4 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center border border-primary/5">
                    <FileText className="h-5 w-5 text-primary/60" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">
                        {script.topic || "Untitled Script"}
                      </span>
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(script.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Mobile Actions Menu */}
                <div className="flex gap-2">
                  <ScriptActions 
                    script={script} 
                    onDelete={() => handleDelete(script.id)}
                    onCopy={() => {
                      navigator.clipboard.writeText(script.script);
                      setCopiedId(script.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    copied={copiedId === script.id}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {script.youtubeUrl ? (
                  <a 
                    href={script.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-1 rounded-md bg-accent/50 border border-border/50 text-[11px] font-medium text-blue-500 hover:bg-accent transition-colors"
                  >
                    <Youtube className="h-3 w-3 text-red-500" />
                    <span>Watch Video</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/50 border border-border/50 text-[10px] font-medium text-muted-foreground">
                    <Tag className="h-3 w-3" />
                    <span>Manual Input</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/50 border border-border/50 text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
                  <Zap className="h-2.5 w-2.5 text-amber-500" />
                  {script.style}
                </div>
                
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200/50 gap-1 font-semibold text-[9px] uppercase tracking-wide h-6">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Ready
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-y border-border">
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title & Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Style</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scripts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-neutral-300" />
                    <p>No scripts found yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              scripts.map((script, index) => (
                <tr key={script.id} className="group hover:bg-neutral-50/50 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center border border-primary/5 group-hover:scale-110 transition-transform">
                        <FileText className="h-5 w-5 text-primary/60" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {script.topic || "Untitled Script"}
                          </span>
                          {index === 0 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-500">
                          <Clock className="h-3 w-3" />
                          {new Date(script.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {script.youtubeUrl ? (
                      <a 
                        href={script.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors group/link"
                      >
                        <div className="p-1 rounded-md bg-red-50 text-red-500 group-hover/link:bg-red-100 transition-colors">
                          <Youtube className="h-3.5 w-3.5" />
                        </div>
                        <span className="max-w-[150px] truncate text-xs font-medium">{truncateUrl(script.youtubeUrl)}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Tag className="h-3 w-3" />
                        <span>Manual Input</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent text-accent-foreground text-xs font-medium">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      {script.style}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200/50 gap-1 font-semibold text-[10px] uppercase tracking-wide">
                      <CheckCircle2 className="h-3 w-3" />
                      Ready
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <ScriptActions 
                        script={script} 
                        onDelete={() => handleDelete(script.id)}
                        onCopy={() => {
                          navigator.clipboard.writeText(script.script);
                          setCopiedId(script.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        copied={copiedId === script.id}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Sub-component for actions to reduce duplication
function ScriptActions({ 
  script, 
  onDelete, 
  onCopy, 
  copied 
}: { 
  script: ScriptItem, 
  onDelete: () => void, 
  onCopy: () => void, 
  copied: boolean 
}) {
  return (
    <div className="flex items-center gap-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-accent hover:shadow-sm border border-transparent hover:border-border" 
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl border-border p-0 sm:p-6 w-[95vw] sm:w-full">
          <DialogHeader className="p-6 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3 mb-2">
               <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold px-2.5 py-0.5 uppercase">
                 {script.style}
               </Badge>
               <span className="text-xs text-muted-foreground font-medium">{new Date(script.date).toLocaleDateString()}</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-tight">
              {script.topic}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground mt-1">
               Review your generated script and copy it for use.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 sm:p-8 space-y-6 scrollbar-thin scrollbar-thumb-neutral-200">
            {script.youtubeUrl && (
               <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border">
                 <div className="bg-red-500/10 p-2 rounded-lg text-red-500 hidden xs:block">
                   <Youtube size={18} />
                 </div>
                 <div className="flex flex-col min-w-0">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Source Video</span>
                   <a href={script.youtubeUrl} target="_blank" rel="noopener" className="text-xs font-semibold text-blue-500 truncate hover:underline">
                     {script.youtubeUrl}
                   </a>
                 </div>
               </div>
            )}

            <div className="space-y-3">
               <div className="flex items-center justify-between gap-4">
                 <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                   <FileText size={16} className="text-primary shrink-0" />
                   <span className="truncate">Script Content</span>
                 </h4>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="h-8 rounded-lg text-xs font-bold gap-2 border-neutral-200 shrink-0"
                   onClick={onCopy}
                 >
                   {copied ? (
                     <><Check size={14} className="text-emerald-500" /> Copied!</>
                   ) : (
                     <><Copy size={14} /> Copy</>
                   )}
                 </Button>
               </div>
                <div className="bg-neutral-950 rounded-2xl p-4 sm:p-6 prose prose-invert prose-sm max-w-none border border-neutral-800 shadow-xl overflow-y-auto max-h-[400px]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {script.script}
                  </ReactMarkdown>
                </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-accent hover:shadow-sm border border-transparent hover:border-border"
            title="Delete script"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-2xl border-border w-[95vw] sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Script?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the script
              "<span className="font-semibold text-foreground">{script.topic || "Untitled"}</span>" from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="rounded-xl border-neutral-200 mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-200 transition-all font-bold"
            >
              Delete Script
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
