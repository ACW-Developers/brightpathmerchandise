import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, User, Mail, Lock } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Password updated" }); setNewPassword(""); }
    setSaving(false);
  };

  return (
    <AdminLayout title="Profile">
      <div className="max-w-lg space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold font-space">Admin Account</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
              <Input value={user?.email || ""} disabled className="bg-muted/30" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Lock className="w-4 h-4" /> New Password</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
            </div>

            <Button onClick={handleChangePassword} disabled={saving || !newPassword} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Password
            </Button>
          </div>
        </div>

        <div className="glass-card p-6">
          <h4 className="font-semibold font-space mb-2">Account Details</h4>
          <div className="text-sm space-y-2 text-muted-foreground">
            <p>User ID: <span className="font-mono text-xs">{user?.id}</span></p>
            <p>Created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
            <p>Last Sign In: {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
