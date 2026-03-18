
'use client';

import React, { useState, useEffect } from "react";
import ScriptGenerator from "@/components/ScriptGenerator";
import AppLayout from "@/components/AppLayout";
import { getHistoryAsync, ScriptItem } from "@/lib/history-utils";
import RecentScriptsTable from "@/components/RecentScriptsTable";
import DashboardStats from "@/components/DashboardStats";
import { Sparkles, LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export default function DashboardPage() {
  const [recentScripts, setRecentScripts] = useState<Array<ScriptItem>>([]);
  const [allHistory, setAllHistory] = useState<Array<ScriptItem>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const history = await getHistoryAsync();
      setAllHistory(history);
      setRecentScripts(history.slice(0, 5));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRefresh = () => {
    fetchHistory();
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-10">
        <PageHeader 
          title="Dashboard Overview"
          description="Manage your AI-powered YouTube scripts and analyze performance."
          icon={LayoutDashboard}
          iconColor="text-amber-400"
        />

        {/* Stats Section */}
        <DashboardStats scripts={allHistory} />

        {/* Recent Scripts Table Card */}
        <div className="w-full">
          <RecentScriptsTable scripts={recentScripts} onRefresh={handleRefresh} />
        </div>
      </div>
    </AppLayout>
  );
}
