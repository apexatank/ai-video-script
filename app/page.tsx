
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Youtube, 
  Sparkles, 
  Zap, 
  BarChart3, 
  Layers, 
  ArrowRight, 
  Play, 
  CheckCircle2,
  ScrollText,
  ImageIcon,
  Anchor,
  Search,
  Gauge
} from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-rose-100 selection:text-rose-600">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="bg-rose-600 p-2 rounded-xl text-white shadow-lg shadow-rose-200">
              <Youtube size={22} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60">
              ScriptAI
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-10"
          >
            <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-rose-600 transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-semibold text-muted-foreground hover:text-rose-600 transition-colors">Solutions</a>
            <a href="#pricing" className="text-sm font-semibold text-muted-foreground hover:text-rose-600 transition-colors">Pricing</a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/login" className="hidden sm:block text-sm font-bold text-foreground px-5 py-2.5 rounded-full hover:bg-accent transition-all">
              Log in
            </Link>
            <Link href="/register" className="bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-bold hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-foreground/10 hover:shadow-rose-500/20 hover:scale-105 active:scale-95">
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-24 lg:pt-52 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] -z-10" 
        />
        <motion.div 
           animate={{ scale: [1, 1.2, 1] }}
           transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" 
        />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[13px] font-bold mb-8"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Next Gen AI for YouTube Creators</span>
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.1] mb-8">
              Write Scripts that <br />
              <motion.span 
                initial={{ backgroundSize: "0% 100%" }}
                animate={{ backgroundSize: "100% 100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-rose-600 underline decoration-rose-200 dark:decoration-rose-500/30 underline-offset-8"
              >
                Capture Attention.
              </motion.span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg lg:text-xl text-muted-foreground font-medium leading-relaxed mb-12">
              The all-in-one AI platform to generate high-performing YouTube scripts, 
              catchy hooks, and creative thumbnail ideas in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/register" className="w-full sm:w-auto bg-foreground text-background px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all shadow-2xl shadow-foreground/5 hover:shadow-rose-500/20 group">
                Start Generating Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto border-2 border-border text-foreground px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 hover:bg-accent transition-all">
                <Play size={18} fill="currentColor" />
                Watch Demo
              </button>
            </div>

            {/* Hero Stats */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 grayscale opacity-60 max-w-4xl mx-auto"
            >
              {[
                { label: '100k+ Scripts', value: '100k+' },
                { label: '5M+ Views', value: '5M+' },
                { label: '4.9/5 Rating', value: '4.9/5' },
                { label: '50k+ Creators', value: '50k+' }
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="flex flex-col items-center">
                   <span className="text-xl font-bold bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-transparent tracking-tighter">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-accent/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Everything you need to <br />
              Grow your Channel
            </h2>
            <p className="text-muted-foreground font-medium text-lg">Powerful AI tools designed specifically for the YouTube ecosystem.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <FeatureCard 
              icon={ScrollText}
              iconColor="text-rose-500"
              bgColor="bg-rose-500/10"
              title="Script Generator"
              description="From idea to a full, engaging script in minutes. Tailored to your voice and audience."
              variants={itemVariants}
            />
             <FeatureCard 
              icon={Anchor}
              iconColor="text-indigo-500"
              bgColor="bg-indigo-500/10"
              title="Hook Master"
              description="Never lose an audience. Generate 10+ patterns of addictive video openers."
              variants={itemVariants}
            />
            <FeatureCard 
              icon={ImageIcon}
              iconColor="text-amber-500"
              bgColor="bg-amber-500/10"
              title="Thumbnail Ideas"
              description="Creative, high-CTR concept ideas that get you onto the recommended feed."
              variants={itemVariants}
            />
            <FeatureCard 
              icon={Gauge}
              iconColor="text-emerald-500"
              bgColor="bg-emerald-500/10"
              title="Script Analyzer"
              description="AI-driven feedback on your script's retention potential and flow."
              variants={itemVariants}
            />
            <FeatureCard 
              icon={Search}
              iconColor="text-blue-500"
              bgColor="bg-blue-500/10"
              title="SEO Assistant"
              description="Optimize titles, tags, and descriptions for maximum search visibility."
              variants={itemVariants}
            />
            <FeatureCard 
              icon={Zap}
              iconColor="text-orange-500"
              bgColor="bg-orange-500/10"
              title="Real-time Speed"
              description="Lightning-fast processing powered by the latest LLM architectures."
              variants={itemVariants}
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="inline-flex px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-[12px] font-bold mb-6">WORKFLOW</div>
                <h2 className="text-4xl font-bold text-foreground tracking-tight mb-8">How it works</h2>
                
                <div className="space-y-10">
                   <Step 
                    number="01" 
                    title="Enter your Topic" 
                    description="Simply provide a keyword or a brief idea of what you want to create." 
                   />
                   <Step 
                    number="02" 
                    title="Generate AI Drafts" 
                    description="Our AI generates multiple script drafts, thumbnail ideas, and hooks." 
                   />
                   <Step 
                    number="03" 
                    title="Customize & Publish" 
                    description="Refine your content, export to your favorite editor, and ready to record." 
                   />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 relative"
              >
                <div className="relative z-10 bg-accent rounded-[40px] p-6 lg:p-12 shadow-2xl overflow-hidden">
                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     whileInView={{ y: 0, opacity: 1 }}
                     transition={{ delay: 0.3 }}
                     className="bg-card rounded-2xl shadow-sm p-6 border border-border/50"
                   >
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-8 h-8 rounded-full bg-rose-500" />
                         <div className="h-4 w-32 bg-muted rounded-full" />
                      </div>
                      <div className="space-y-3 mb-8">
                         <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 0.8 }} className="h-3 bg-muted rounded-full" />
                         <motion.div initial={{ width: 0 }} whileInView={{ width: "90%" }} transition={{ duration: 0.8, delay: 0.2 }} className="h-3 bg-muted rounded-full" />
                         <motion.div initial={{ width: 0 }} whileInView={{ width: "70%" }} transition={{ duration: 0.8, delay: 0.4 }} className="h-3 bg-muted/50 rounded-full" />
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", delay: 1 }}
                        className="p-4 bg-accent rounded-xl border border-rose-500/20"
                      >
                        <div className="flex items-center gap-2 mb-3">
                           <Sparkles size={14} className="text-rose-500" />
                           <span className="text-[10px] font-bold text-rose-600 uppercase">AI Recommendation</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">Add a story loop in the first 30 seconds to increase retention by 20%.</p>
                      </motion.div>
                   </motion.div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl z-0" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl z-0" />
              </motion.div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-slate-900 rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden shadow-3xl"
        >
           <div className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-rose-600/20 via-transparent to-indigo-600/20 opacity-50" />
           <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">Ready to transform your content?</h2>
              <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">Join 50k+ creators using ScriptAI to save time and grow faster.</p>
              <Link href="/register" className="bg-white text-slate-900 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-rose-500 hover:text-white transition-all inline-flex items-center gap-3 shadow-xl">
                 Get Started for Free
                 <ArrowRight size={20} />
              </Link>
              <p className="mt-8 text-slate-500 text-sm font-medium">No credit card required. Free 7-day trial of Pro features.</p>
           </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
              <div className="space-y-6">
                 <div className="flex items-center gap-2" >
                    <div className="bg-rose-600 p-2 rounded-xl text-white">
                      <Youtube size={18} fill="currentColor" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground">ScriptAI</span>
                 </div>
                 <p className="text-muted-foreground text-sm leading-relaxed">The ultimate toolkit for modern video creators. Scripted, optimized, and ready for virality.</p>
              </div>
              
              <div>
                 <h4 className="font-bold text-foreground mb-6">Product</h4>
                 <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                    <li><a href="#" className="hover:text-rose-600 transition-colors">Script Generator</a></li>
                    <li><a href="#" className="hover:text-rose-600 transition-colors">Thumbnail Ideas</a></li>
                    <li><a href="#" className="hover:text-rose-600 transition-colors">Hook Master</a></li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-bold text-foreground mb-6">Company</h4>
                 <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                    <li><a href="#" className="hover:text-rose-600 transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-rose-600 transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-rose-600 transition-colors">Contact</a></li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-bold text-foreground mb-6">Legal</h4>
                 <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                    <li><a href="#" className="hover:text-rose-600 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-rose-600 transition-colors">Terms of Service</a></li>
                 </ul>
              </div>
           </div>
           
           <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-muted-foreground text-xs">© 2024 ScriptAI. All rights reserved.</p>
              <div className="flex items-center gap-8">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Zap size={18} /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><BarChart3 size={18} /></a>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, iconColor, bgColor, variants }: any) {
  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-8 rounded-[32px] bg-card border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/5 group"
    >
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center ${iconColor} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-card-foreground mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground font-medium text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function Step({ number, title, description }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex gap-6"
    >
       <div className="text-2xl font-black text-muted tracking-tighter">{number}</div>
       <div>
         <h4 className="text-xl font-bold text-foreground mb-2">{title}</h4>
         <p className="text-muted-foreground font-medium text-sm leading-relaxed">{description}</p>
       </div>
    </motion.div>
  );
}
