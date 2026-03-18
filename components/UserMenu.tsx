"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  LogOut, 
  CreditCard, 
  Bookmark, 
  History,
  LifeBuoy,
  Mail,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getProfile, getProfileAsync, UserProfile } from "@/lib/profile-utils";
import { getBookmarks } from "@/lib/history-utils";

export function UserMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [bookmarkCount, setBookmarkCount] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      // Always set local first for instant feedback
      setProfile(getProfile());
      setBookmarkCount(getBookmarks().length);
      
      // If menu is opening, fetch fresh data from API
      if (isOpen) {
        try {
          const freshProfile = await getProfileAsync();
          setProfile(freshProfile);
        } catch (error) {
          console.error("Failed to fetch fresh profile:", error);
        }
      }
    };
    fetchData();
  }, [isOpen]);

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="outline-none focus:ring-2 focus:ring-primary/20 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group relative">
          <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-600 via-primary to-rose-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20 border-2 border-white/50 group-hover:border-white transition-all overflow-hidden">
            {profile ? `${profile.firstName[0]}${profile.lastName[0]}` : "JD"}
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </div>
          {/* Active status indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full shadow-sm" />
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              asChild
              align="end"
              sideOffset={12}
              className="z-50 min-w-[280px] overflow-hidden rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] outline-none"
            >
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(10px)" }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 300
                }}
              >
                {/* Header Section */}
                  <div className="px-4 py-4 mb-1 bg-accent/50 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-linear-to-tr from-indigo-600 to-primary flex items-center justify-center text-white font-bold shadow-inner">
                        {profile ? `${profile.firstName[0]}${profile.lastName[0]}` : "JD"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-foreground leading-none">
                            {profile ? `${profile.firstName} ${profile.lastName}` : "John Doe"}
                          </p>
                          <ShieldCheck size={14} className="text-blue-500" />
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground mt-1.5 flex items-center gap-1.5">
                          <Mail size={12} className="opacity-70" />
                          {profile?.email || "john.doe@example.com"}
                        </p>
                      </div>
                    </div>
                  
                  {/* Pro Badge/Status */}
                  <div className="mt-4 p-2.5 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Pro Plan</span>
                    <Link href="/billing" className="text-[10px] font-bold text-primary hover:underline">
                      Upgrade
                    </Link>
                  </div>
                </div>
                
                <div className="p-1 space-y-1">
                  <DropdownItem icon={User} label="Profile" href="/profile" />
                  <DropdownItem 
                    icon={Bookmark} 
                    label="Bookmarks" 
                    href="/bookmarks" 
                    badge={bookmarkCount > 0 ? bookmarkCount.toString() : undefined} 
                  />
                  <DropdownItem icon={History} label="History" href="/history" />
                </div>

                <div className="h-px bg-border my-1.5 mx-2" />
                
                <div className="p-1 space-y-1">
                  <DropdownItem icon={CreditCard} label="Billing" href="/billing" />
                  <DropdownItem icon={Settings} label="Settings" href="/settings" />
                </div>

                <div className="h-px bg-border my-1.5 mx-2" />

                <div className="p-1">
                   <DropdownItem icon={LifeBuoy} label="Support" href="/support" />
                   <DropdownItem 
                    icon={LogOut} 
                    label="Log out" 
                    href="/logout" 
                    className="text-rose-500 hover:bg-rose-50 hover:text-rose-600" 
                  />
                </div>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}

function DropdownItem({ 
  icon: Icon, 
  label, 
  href, 
  badge,
  className 
}: { 
  icon: any, 
  label: string, 
  href: string,
  badge?: string,
  className?: string
}) {
  return (
    <DropdownMenu.Item asChild>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-200 outline-none cursor-pointer group",
          "hover:bg-accent text-muted-foreground hover:text-foreground",
          className
        )}
      >
        <div className="p-1.5 bg-accent group-hover:bg-card rounded-lg transition-colors">
          <Icon size={16} className="opacity-90 transition-transform group-hover:scale-110" />
        </div>
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-foreground text-background rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            {badge}
          </span>
        )}
      </Link>
    </DropdownMenu.Item>
  );
}
