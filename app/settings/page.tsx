
"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getSettingsAsync, saveSettingsAsync, AppSettings } from "@/lib/settings-utils";
import { clearHistoryAsync } from "@/lib/history-utils";
import { Loader2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Settings2, 
  Globe, 
  Palette, 
  Key, 
  Trash2, 
  Save, 
  AlertTriangle 
} from "lucide-react";
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
import { PageHeader } from "@/components/PageHeader";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    defaultLanguage: "English",
    defaultStyle: "Educational",
    apiKey: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const data = await getSettingsAsync();
        setSettings(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await saveSettingsAsync(settings);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("idle");
    }
  };

  const handleClearHistory = async () => {
    await clearHistoryAsync();
    window.location.reload(); 
  };

  const languageOptions = [
    "English", "Gujarati", "Hindi", "Spanish", "French", 
    "German", "Chinese", "Japanese"
  ];

  const styleOptions = [
    "Educational", "Funny", "Motivational", "Documentary", 
    "Vlog", "Review", "News", "Tutorial"
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        <PageHeader 
          title="App Settings"
          description="Personalize your experience and manage account preferences."
          icon={Settings}
          iconColor="text-rose-500"
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border">
            <Loader2 className="text-primary animate-spin mb-4" size={40} />
            <p className="text-muted-foreground font-medium animate-pulse">Loading settings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border bg-card shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border">
                <div className="flex items-center gap-2">
                  <Globe className="text-primary" size={20} />
                  <CardTitle className="text-lg text-foreground">Defaults</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">Set your preferred default language and style for new scripts.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-lang" className="text-sm font-semibold text-foreground">Default Language</Label>
                    <Select 
                      value={settings.defaultLanguage} 
                      onValueChange={(val) => setSettings({...settings, defaultLanguage: val})}
                    >
                      <SelectTrigger id="default-lang" className="rounded-xl border-border bg-accent/50 h-11 focus:ring-primary/20">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-style" className="text-sm font-semibold text-foreground">Default Style</Label>
                    <Select 
                      value={settings.defaultStyle} 
                      onValueChange={(val) => setSettings({...settings, defaultStyle: val})}
                    >
                      <SelectTrigger id="default-style" className="rounded-xl border-border bg-accent/50 h-11 focus:ring-primary/20">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {styleOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border">
                <div className="flex items-center gap-2">
                  <Key className="text-primary" size={20} />
                  <CardTitle className="text-lg text-foreground">AI Configuration</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">Manage your API keys and model preferences.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-sm font-semibold text-foreground">OpenAI API Key (Optional)</Label>
                  <Input 
                    id="api-key" 
                    type="password" 
                    placeholder="sk-..." 
                    value={settings.apiKey || ""}
                    onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                    className="rounded-xl border-border h-11 focus:ring-primary/20 bg-accent/50"
                  />
                  <p className="text-xs text-muted-foreground italic">If left blank, the system-wide key will be used (if available).</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full rounded-xl h-12 shadow-lg shadow-primary/20 gap-2 font-bold" 
                  onClick={handleSave}
                  disabled={saveStatus === "saving"}
                >
                  {saveStatus === "saving" ? (
                    "Saving..."
                  ) : saveStatus === "saved" ? (
                    "Saved Successfully!"
                  ) : (
                    <>
                      <Save size={18} />
                      Save Settings
                    </>
                  )}
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full rounded-xl h-12 border-border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 gap-2 transition-colors text-muted-foreground font-semibold">
                      <Trash2 size={18} />
                      Clear History
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border-border bg-card">
                    <AlertDialogHeader>
                      <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="text-red-500" size={24} />
                      </div>
                      <AlertDialogTitle className="text-xl text-foreground">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This action cannot be undone. This will permanently delete your entire generation history from this device.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                      <AlertDialogCancel className="rounded-xl border-border bg-accent text-foreground hover:bg-accent/80">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearHistory} className="bg-red-600 hover:bg-red-700 text-white rounded-xl border-0 font-bold">
                        Yes, delete history
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Palette className="text-primary" size={20} />
                </div>
                <h4 className="font-bold text-foreground">Style Tip</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose a style that matches your channel voice. "Educational" works best for complex topics, while "Documentary" provides deep investigative narratives.
              </p>
            </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
