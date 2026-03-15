import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Store, CreditCard, MessageCircle, Palette, Bell, Globe, Truck, Shield } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const SettingsPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("business");
  const [form, setForm] = useState({
    id: "", business_name: "", business_email: "", business_phone: "",
    business_address: "", currency: "USD", tax_rate: "0",
    whatsapp_number: "", paypal_email: "", venmo_handle: "",
    accent_color: "#38bdf8",
    shipping_fee: "0", free_shipping_enabled: false, free_shipping_threshold: "50",
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
            accent_color: (data as any).accent_color || "#38bdf8",
            shipping_fee: String((data as any).shipping_fee ?? 0),
            free_shipping_enabled: (data as any).free_shipping_enabled ?? false,
            free_shipping_threshold: String((data as any).free_shipping_threshold ?? 50),
          });
        }
        setLoading(false);
      });
    }
  }, [isAdmin]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      business_name: form.business_name,
      business_email: form.business_email,
      business_phone: form.business_phone,
      business_address: form.business_address,
      currency: form.currency,
      tax_rate: parseFloat(form.tax_rate) || 0,
      whatsapp_number: form.whatsapp_number,
      paypal_email: form.paypal_email,
      venmo_handle: form.venmo_handle,
      accent_color: form.accent_color,
      shipping_fee: parseFloat(form.shipping_fee) || 0,
      free_shipping_enabled: form.free_shipping_enabled,
      free_shipping_threshold: parseFloat(form.free_shipping_threshold) || 50,
    } as any;

    let error;
    if (form.id) {
      ({ error } = await supabase.from("store_settings").update(payload).eq("id", form.id));
    } else {
      const { data, error: insertError } = await supabase.from("store_settings").insert(payload).select().single();
      error = insertError;
      if (data) setForm(f => ({ ...f, id: data.id }));
    }

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Settings saved successfully!" });
    setSaving(false);
  };

  const tabs = [
    { id: "business", label: "Business", icon: Store },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "shipping", label: "Shipping", icon: Truck },
  ];

  if (authLoading || loading) {
    return <AdminLayout title="Settings"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Business Info */}
        {activeTab === "business" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><Store className="w-4 h-4 text-primary" /> Business Information</h3>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Business Name</Label><Input value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.business_email} onChange={e => setForm(f => ({ ...f, business_email: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input value={form.business_phone} onChange={e => setForm(f => ({ ...f, business_phone: e.target.value }))} /></div>
                </div>
                <div className="space-y-2"><Label>Address</Label><Input value={form.business_address} onChange={e => setForm(f => ({ ...f, business_address: e.target.value }))} /></div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" /> WhatsApp</h3>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={form.whatsapp_number} onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))} placeholder="15207361677" />
                <p className="text-xs text-muted-foreground">Include country code without +</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment */}
        {activeTab === "payment" && (
          <div className="glass-card p-6">
            <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Payment Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Currency</Label><Input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" step="0.1" value={form.tax_rate} onChange={e => setForm(f => ({ ...f, tax_rate: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>PayPal Email</Label><Input type="email" value={form.paypal_email} onChange={e => setForm(f => ({ ...f, paypal_email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Venmo Handle</Label><Input value={form.venmo_handle} onChange={e => setForm(f => ({ ...f, venmo_handle: e.target.value }))} placeholder="@username" /></div>
            </div>
          </div>
        )}

        {/* Appearance */}
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Theme</h3>
              <div className="flex items-center justify-between py-3 border-b border-border/30">
                <div>
                  <p className="font-medium text-sm">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
              <div className="mt-4 space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.accent_color} onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                  <Input value={form.accent_color} onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))} className="max-w-32" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="glass-card p-6">
            <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: "New Order Alerts", desc: "Get notified when a new order is placed" },
                { label: "Low Stock Warnings", desc: "Alert when product stock falls below 5" },
                { label: "Review Notifications", desc: "Notify when a customer leaves a review" },
                { label: "Payment Confirmations", desc: "Receive payment confirmation notifications" },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping */}
        {activeTab === "shipping" && (
          <div className="glass-card p-6">
            <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Shipping Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/30">
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Offer free shipping on all orders</p>
                </div>
                <Switch checked={form.free_shipping_enabled} onCheckedChange={v => setForm(f => ({ ...f, free_shipping_enabled: v }))} />
              </div>
              <div className="space-y-2">
                <Label>Default Shipping Fee ($)</Label>
                <Input type="number" step="0.01" value={form.shipping_fee} onChange={e => setForm(f => ({ ...f, shipping_fee: e.target.value }))} className="max-w-48" />
              </div>
              <div className="space-y-2">
                <Label>Free Shipping Threshold ($)</Label>
                <Input type="number" step="1" value={form.free_shipping_threshold} onChange={e => setForm(f => ({ ...f, free_shipping_threshold: e.target.value }))} className="max-w-48" />
                <p className="text-xs text-muted-foreground">Orders above this amount get free shipping</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
