
'use client';

import React, { useState } from "react";
import ScriptGenerator from "@/components/ScriptGenerator";
import AppLayout from "@/components/AppLayout";
import TemplatesSection from "@/components/TemplatesSection";
import { Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";

export default function GeneratePage() {
  const [activeTemplate, setActiveTemplate] = useState<{style: string, topic: string} | null>(null);

  const handleTemplateSelect = (template: {style: string, topic: string}) => {
    setActiveTemplate(template);
    // Scroll to generator
    const generatorElement = document.getElementById('script-generator');
    if (generatorElement) {
      generatorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-10 pb-20">
        <PageHeader 
          title="Script Generator"
          description="Create viral-ready YouTube scripts in seconds with AI."
          icon={Wand2}
          badge={
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-2xl text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              AI Powered
            </div>
          }
        />

        {/* Templates Section - Quick Starts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 bg-primary rounded-full" />
            <h2 className="text-lg font-bold text-neutral-900">Choose a Template</h2>
          </div>
          <TemplatesSection onSelect={handleTemplateSelect} />
        </div>

        {/* Main Generator Section */}
        <div id="script-generator" className="max-w-4xl mx-auto w-full">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
            <ScriptGenerator 
              onScriptGenerated={() => {}} 
              preFillStyle={activeTemplate?.style}
              preFillTopic={activeTemplate?.topic}
            />
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
