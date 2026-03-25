"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  imageAlt: string;
}

export function AuthLayout({ children, title, subtitle, imageAlt }: AuthLayoutProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-zinc-950 transition-colors duration-500 overflow-hidden"
    >
      {/* Left side - Visual Content */}
      <div className="hidden lg:flex relative overflow-hidden bg-zinc-100 dark:bg-[#0a0a0b] items-center justify-center p-12">
        <motion.div
           initial={{ opacity: 0, x: -50, filter: "blur(20px)" }}
           animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative z-10 max-w-lg text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="mb-8"
          >
             <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20 rotate-3">
                <span className="text-primary-foreground font-black text-4xl -rotate-3">V</span>
             </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4"
          >
            {title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 mb-8"
          >
            {subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="group relative w-full aspect-square max-w-[480px] rounded-[3rem] overflow-hidden border border-white/20 dark:border-zinc-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] mx-auto overflow-hidden bg-zinc-200 dark:bg-zinc-800"
          >
             <img 
               src="/auth-bg.png" 
               alt={imageAlt}
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 dark:from-zinc-950/80 dark:via-transparent" />
             
             {/* Floating Badge/Overlay */}
             <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-zinc-800 shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-800 bg-zinc-700 flex items-center justify-center text-[10px] text-white">
                           {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                   </div>
                   <span className="text-xs font-medium text-white/80">Trusted by 2k+ creators</span>
                </div>
                <p className="text-sm font-medium text-white italic">
                  "This tool has completely changed my production workflow. Generating scripts has never been this easy and fast."
                </p>
             </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - Auth Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50, filter: "blur(20px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col items-center justify-center p-6 lg:p-12 relative text-zinc-900 dark:text-white"
      >
        <div className="w-full max-w-[440px] mt-12 lg:mt-0">
          <div className="lg:hidden flex flex-col items-center mb-8">
             <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-2xl">V</span>
             </div>
             <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">AI Video Script</h1>
          </div>
          
          {children}
        </div>
        
        <footer className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-500">
           <p>© 2026 AI Video Script. All rights reserved.</p>
           <div className="flex gap-4 justify-center mt-2">
              <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link>
           </div>
        </footer>
      </motion.div>
    </motion.div>
  );
}
