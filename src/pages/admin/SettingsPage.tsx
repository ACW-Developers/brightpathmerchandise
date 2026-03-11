import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

const SettingsPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "", business_name: "", business_email: "", business_phone: "",
    business_address: "", currency: "USD", tax_rate: "0",
    whatsapp_number: "", paypal_email: "", venmo_handle: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("store_settings").select("*").limit(1).single().then(({ data }) => {
        if (data) {
          setForm({
            id: data.id, business_name: data.business_name || "",
            business_email: (data as any).business_email || "",
            business_phone: (data as any).business_phone || "",
            business_address: (data as any).business_address || "",
            currency: data.currency || "USD",
            tax_rate: String((data as any).tax_rate || 0),
            whatsapp_number: (data as any).whatsapp_number || "",
            paypal_email: (data as any).paypal_email || "",
            venmo_handle: (data as any).venmo_handle || "",
          });
        }
        setLoading(false);
      });
    }
  }, [isAdmin]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("store_settings").update({
      business_name: form.business_name,
      business_email: form.business_email,
      business_phone: form.business_phone,
      business_address: form.business_address,
      currency: form.currency,
      tax_rate: parseFloat(form.tax_rate) || 0,
      whatsapp_number: form.whatsapp_number,
      paypal_email: form.paypal_email,
      venmo_handle: form.venmo_handle,
    } as any).eq("id", form.id);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Settings saved" });
    setSaving(false);
  };

  if (authLoading || loading) {
    return <AdminLayout title="Settings"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-8">
        {/* Business Info */}
        <div className="glass-card p-6">
          <h3 className="font-semibold font-space mb-4">Business Information</h3>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Business Name</Label><Input value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input value={form.business_email} onChange={e => setForm(f => ({ ...f, business_email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={form.business_phone} onChange={e => setForm(f => ({ ...f, business_phone: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Address</Label><Input value={form.business_address} onChange={e => setForm(f => ({ ...f, business_address: e.target.value }))} /></div>
          </div>
        </div>

        {/* Payment */}
        <div className="glass-card p-6">
          <h3 className="font-semibold font-space mb-4">Payment Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Currency</Label><Input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" step="0.1" value={form.tax_rate} onChange={e => setForm(f => ({ ...f, tax_rate: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>PayPal Email</Label><Input value={form.paypal_email} onChange={e => setForm(f => ({ ...f, paypal_email: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Venmo Handle</Label><Input value={form.venmo_handle} onChange={e => setForm(f => ({ ...f, venmo_handle: e.target.value }))} placeholder="@username" /></div>
            <div className="space-y-2"><Label>WhatsApp Number</Label><Input value={form.whatsapp_number} onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))} /></div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </Button>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
