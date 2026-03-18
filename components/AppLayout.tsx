"use client";

import { ReactNode, useState, useEffect } from "react";
import { YoutubeIcon, ScrollText, History, Settings, Home, Bookmark, Search, Menu, X, Image as ImageIcon, Anchor, Gauge } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Script Generator", href: "/generate", icon: ScrollText },
    { name: "Thumbnail Ideas", href: "/thumbnails", icon: ImageIcon },
    { name: "Hook Generator", href: "/hooks", icon: Anchor },
    { name: "Script Analyzer", href: "/analyze", icon: Gauge },
    { name: "SEO Assistant", href: "/seo", icon: Search },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const getBreadcrumb = () => {
    const item = navItems.find((i) => i.href === pathname);
    return item ? item.name : "Home";
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 mb-10 px-2 mt-4 md:mt-0">
        <div className="bg-primary/10 p-2 rounded-xl">
          <YoutubeIcon className="text-primary" size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">Script AI</span>
      </div>
      
      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon size={18} className={cn(
                "transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-4 py-4 bg-accent/50 rounded-2xl border border-border/50">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">All systems operational</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-card border-r border-border flex-col py-8 px-6 shadow-sm hidden md:flex h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-[280px] bg-card z-50 p-6 flex flex-col shadow-2xl md:hidden"
              >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 md:h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 md:px-8 sticky top-0 z-30">
          {/* Mobile Logo & Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 active:scale-95 transition-transform">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <YoutubeIcon className="text-primary" size={18} />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">Script AI</span>
            </Link>
          </div>

          {/* Desktop Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <div className="p-1.5 bg-accent rounded-lg">
              <Home size={14} className="text-muted-foreground" />
            </div>
            <span className="text-muted-foreground/30 mx-1">/</span>
            <span className="font-medium text-foreground">
              {getBreadcrumb()}
            </span>
          </div>
          
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <Link 
              href="/bookmarks"
              className="flex items-center gap-2 px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all font-medium text-sm group"
            >
              <div className="p-1 px-1.5 bg-accent group-hover:bg-card rounded-lg transition-colors border border-border hidden xs:block">
                <Bookmark size={14} className="text-muted-foreground" />
              </div>
              <span className="hidden sm:inline">All Bookmarks</span>
              <Bookmark size={18} className="sm:hidden text-muted-foreground" />
            </Link>
            
            <div className="w-px h-6 bg-border mx-1" />
            
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
