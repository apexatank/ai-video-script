"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { getProfileAsync, saveProfileAsync, UserProfile } from "@/lib/profile-utils";
import { 
  User, 
  Mail, 
  Camera, 
  Shield, 
  Settings as SettingsIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getProfileAsync();
        setProfile(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (profile) {
      setIsSaving(true);
      try {
        const updated = await saveProfileAsync(profile);
        setProfile(updated);
        setIsEditing(false);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfile(prev => prev ? { ...prev, [id]: value } : null);
  };

  if (isLoading || !profile) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="text-primary" size={48} />
          </motion.div>
          <p className="text-muted-foreground font-medium animate-pulse">Loading your profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 rounded-[32px] bg-linear-to-r from-primary via-indigo-600 to-rose-500 overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </motion.div>

        <div className="relative -mt-20 px-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ type: "spring", damping: 15 }}
               className="relative"
            >
              <div className="h-40 w-40 rounded-[40px] border-8 border-background bg-linear-to-tr from-accent to-accent/50 flex items-center justify-center text-4xl font-bold text-muted-foreground shadow-xl overflow-hidden">
                <span className="bg-linear-to-tr from-indigo-600 to-rose-500 bg-clip-text text-transparent">
                  {profile.firstName[0]}{profile.lastName[0]}
                </span>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer">
                  <Camera className="text-white" size={32} />
                </div>
              </div>
              <div className="absolute bottom-4 right-0 h-8 w-8 bg-green-500 border-4 border-background rounded-full shadow-lg" />
            </motion.div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">{profile.firstName} {profile.lastName}</h1>
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} />
                  Pro Member
                </div>
              </div>
              <p className="text-muted-foreground font-medium mt-1">{profile.role}</p>
            </div>

            <div className="pb-2">
              <Button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={isSaving}
                className={`rounded-2xl px-6 h-12 font-bold shadow-lg transition-all ${
                  isEditing 
                    ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" 
                    : "bg-primary hover:bg-primary/90 shadow-primary/20"
                } hover:scale-105 active:scale-95`}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </div>
                ) : isEditing ? (
                  <div className="flex items-center gap-2">
                    <Save size={18} />
                    Save Changes
                  </div>
                ) : (
                  "Edit Profile"
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
          <div className="md:col-span-2 space-y-8">
            <Card className="rounded-[32px] border border-border shadow-sm overflow-hidden bg-card">
              <CardHeader className="border-b border-border bg-muted/30 px-8 py-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <User size={20} className="text-muted-foreground" />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profile.firstName} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="rounded-xl h-12 bg-accent/50 border-border focus:bg-background transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profile.lastName} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="rounded-xl h-12 bg-accent/50 border-border focus:bg-background transition-all font-medium" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-12 rounded-xl h-12 bg-accent/50 border-border focus:bg-background transition-all font-medium" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Bio</Label>
                  <textarea 
                    id="bio"
                    rows={4}
                    disabled={!isEditing}
                    value={profile.bio}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-accent/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all font-medium text-sm resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Professional Role</Label>
                  <Input 
                    id="role" 
                    value={profile.role} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="rounded-xl h-12 bg-accent/50 border-border focus:bg-background transition-all font-medium" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border border-border bg-neutral-900 shadow-xl overflow-hidden text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold">Subscription Plan</h3>
                    <p className="text-neutral-400 text-sm mt-1">You are currently on the Pro Annual plan.</p>
                  </div>
                  <Shield size={40} className="text-primary" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400 font-medium">Next billing date</span>
                    <span className="font-bold">Oct 12, 2026</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%]" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-bold uppercase tracking-wider">
                    <span>Usage</span>
                    <span>75 / 100 Scripts</span>
                  </div>
                </div>
                <Button className="w-full mt-8 rounded-2xl h-12 bg-white text-black hover:bg-neutral-100 font-bold transition-transform active:scale-95">
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-[32px] border border-border bg-card shadow-sm overflow-hidden">
               <CardHeader className="px-6 py-4 border-b border-border">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                    <Clock size={16} className="text-muted-foreground" />
                    Quick Stats
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">42</p>
                      <p className="text-xs text-muted-foreground">Total Scripts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">12</p>
                      <p className="text-xs text-muted-foreground">Bookmarked</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                      <SettingsIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Education</p>
                      <p className="text-xs text-muted-foreground">Primary Category</p>
                    </div>
                  </div>
               </CardContent>
            </Card>

            <div className="p-6 bg-accent rounded-[32px] border border-border">
               <h4 className="font-bold text-foreground text-sm">Need help?</h4>
               <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Contact our support team if you have any questions or issues with your account.</p>
               <Button variant="link" className="px-0 h-auto text-xs font-bold text-primary mt-3 hover:no-underline">
                 Contact Support →
               </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
