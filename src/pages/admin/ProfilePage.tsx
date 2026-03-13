import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, User, Mail, Lock, Camera, Phone, Calendar, Shield } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({ full_name: "", phone: "", avatar_url: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await (supabase.from("profiles") as any).select("*").eq("id", user.id).single();
      if (data) setProfile({ full_name: data.full_name || "", phone: data.phone || "", avatar_url: data.avatar_url || "" });
      else {
        // Create profile if doesn't exist
        await (supabase.from("profiles") as any).insert({ id: user.id, full_name: "" });
      }
    };
    loadProfile();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadErr) { toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = publicUrl + "?t=" + Date.now();
    await (supabase.from("profiles") as any).update({ avatar_url: url }).eq("id", user.id);
    setProfile(p => ({ ...p, avatar_url: url }));
    toast({ title: "Avatar updated!" });
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await (supabase.from("profiles") as any).update({ full_name: profile.full_name, phone: profile.phone }).eq("id", user.id);
    toast({ title: "Profile saved!" });
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Password updated" }); setNewPassword(""); setConfirmPassword(""); }
    setSaving(false);
  };

  return (
    <AdminLayout title="Profile">
      <div className="max-w-2xl space-y-6">
        {/* Avatar & Name Card */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted/30 border-2 border-primary/20 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Camera className="w-5 h-5 text-white" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold font-space">{profile.full_name || "Admin"}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start mt-1">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="glass-card p-6">
          <h4 className="font-semibold font-space mb-4 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Personal Information</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</Label>
                <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</Label>
              <Input value={user?.email || ""} disabled className="bg-muted/30" />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile
            </Button>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-6">
          <h4 className="font-semibold font-space mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Security</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <Button onClick={handleChangePassword} disabled={saving || !newPassword} variant="outline" className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Update Password
            </Button>
          </div>
        </div>

        {/* Account Details */}
        <div className="glass-card p-6">
          <h4 className="font-semibold font-space mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Account Details</h4>
          <div className="text-sm space-y-2 text-muted-foreground">
            <div className="flex justify-between py-2 border-b border-border/30">
              <span>Account Created</span>
              <span className="font-medium text-foreground">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/30">
              <span>Last Sign In</span>
              <span className="font-medium text-foreground">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>User ID</span>
              <span className="font-mono text-xs text-foreground">{user?.id?.slice(0, 12)}...</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
