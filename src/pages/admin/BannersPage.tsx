import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Upload, ImageIcon, Info } from "lucide-react";
import type { MarketingBanner } from "@/types/product";

const POSITIONS = [
  { value: "hero", label: "Home Hero", hint: "1200×150 — Full-width banner at top of homepage" },
  { value: "home-mid", label: "Home Middle", hint: "1200×130 — Between featured & sale sections" },
  { value: "home-bottom", label: "Home Bottom", hint: "1200×120 — Above the footer on homepage" },
  { value: "shop-top", label: "Shop Top", hint: "1200×120 — Top of shop page" },
  { value: "shop-mid", label: "Shop Mid", hint: "1200×110 — Between product rows" },
  { value: "shop-bottom", label: "Shop Bottom", hint: "1200×120 — Bottom of shop page" },
  { value: "sidebar", label: "Sidebar", hint: "300×600 — Vertical sidebar ad" },
];

const BannersPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [banners, setBanners] = useState<MarketingBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<MarketingBanner | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "", image_url: "", link_url: "", position: "hero",
    display_order: "0", is_active: true,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchBanners();
  }, [isAdmin]);

  const fetchBanners = async () => {
    const { data } = await supabase.from("marketing_banners").select("*").order("position").order("display_order");
    setBanners((data as MarketingBanner[]) || []);
    setLoading(false);
  };

  const openNew = () => {
    setEditBanner(null);
    setForm({ title: "", image_url: "", link_url: "", position: "hero", display_order: "0", is_active: true });
    setDialogOpen(true);
  };

  const openEdit = (b: MarketingBanner) => {
    setEditBanner(b);
    setForm({
      title: b.title, image_url: b.image_url, link_url: b.link_url || "",
      position: b.position, display_order: String(b.display_order), is_active: b.is_active,
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm(f => ({ ...f, image_url: urlData.publicUrl }));
      toast({ title: "Image uploaded" });
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!form.title || !form.image_url) {
      toast({ title: "Title and image are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const pos = POSITIONS.find(p => p.value === form.position);
    const payload = {
      title: form.title,
      image_url: form.image_url,
      link_url: form.link_url || null,
      position: form.position,
      display_order: parseInt(form.display_order) || 0,
      is_active: form.is_active,
      dimensions_hint: pos?.hint?.split(" — ")[0] || "1200x400",
    };

    if (editBanner) {
      const { error } = await supabase.from("marketing_banners").update(payload).eq("id", editBanner.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("marketing_banners").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    }

    toast({ title: editBanner ? "Banner updated" : "Banner created" });
    setSaving(false);
    setDialogOpen(false);
    fetchBanners();
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("marketing_banners").delete().eq("id", id);
    toast({ title: "Banner deleted" });
    fetchBanners();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("marketing_banners").update({ is_active: active }).eq("id", id);
    fetchBanners();
  };

  if (authLoading || loading) {
    return <AdminLayout title="Marketing Banners"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Marketing Banners">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground text-sm">{banners.length} banners</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Add promotional images at strategic locations on the store</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-1"><Plus className="w-4 h-4" /> Add Banner</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-space">{editBanner ? "Edit Banner" : "New Banner"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Spring Sale Banner" /></div>

              <div className="space-y-2">
                <Label>Position *</Label>
                <Select value={form.position} onValueChange={v => setForm(f => ({ ...f, position: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        <div>
                          <span className="font-medium">{p.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">{p.hint}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>Recommended: {POSITIONS.find(p => p.value === form.position)?.hint}</span>
                </div>
              </div>

              <div className="space-y-2"><Label>Link URL (optional)</Label><Input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} placeholder="/shop or https://..." /></div>
              <div className="space-y-2"><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: e.target.value }))} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>

              <div className="space-y-2">
                <Label>Banner Image *</Label>
                {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
                <div className="flex gap-2 items-center">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editBanner ? "Update" : "Create"} Banner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No banners yet. Add one to promote your products!</TableCell></TableRow>
            ) : banners.map(b => (
              <TableRow key={b.id}>
                <TableCell>
                  <img src={b.image_url} alt={b.title} className="w-24 h-12 object-cover rounded-lg" />
                </TableCell>
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {POSITIONS.find(p => p.value === b.position)?.label || b.position}
                  </span>
                </TableCell>
                <TableCell>
                  <Switch checked={b.is_active} onCheckedChange={v => toggleActive(b.id, v)} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteBanner(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default BannersPage;
