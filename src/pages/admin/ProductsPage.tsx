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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, ImageIcon, Upload, X } from "lucide-react";
import type { Product } from "@/types/product";

const PRESET_COLORS = [
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00",
  "#ff00ff", "#808080", "#800000", "#000080", "#ffa500", "#800080",
  "#008080", "#c0c0c0", "#ffd700",
];

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size"];

const ProductsPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "General", brand: "",
    is_featured: false, is_on_sale: false, sale_price: "", stock_quantity: "0", image_url: "",
    colors: [] as string[], sizes: [] as string[],
  });
  const [customColor, setCustomColor] = useState("");
  const [customSize, setCustomSize] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(
      (data || []).map((d: any) => ({
        ...d,
        colors: Array.isArray(d.colors) ? d.colors : [],
        sizes: Array.isArray(d.sizes) ? d.sizes : [],
        brand: d.brand || null,
      })) as Product[]
    );
    setLoading(false);
  };

  const openNew = () => {
    setEditProduct(null);
    setForm({ name: "", description: "", price: "", category: "General", brand: "", is_featured: false, is_on_sale: false, sale_price: "", stock_quantity: "0", image_url: "", colors: [], sizes: [] });
    setAdditionalImages([]);
    setDialogOpen(true);
  };

  const openEdit = async (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description || "", price: String(p.price),
      category: p.category, brand: p.brand || "", is_featured: p.is_featured, is_on_sale: p.is_on_sale,
      sale_price: p.sale_price ? String(p.sale_price) : "", stock_quantity: String(p.stock_quantity),
      image_url: p.image_url || "", colors: p.colors || [], sizes: p.sizes || [],
    });
    const { data: imgs } = await supabase.from("product_images").select("image_url").eq("product_id", p.id).order("display_order");
    setAdditionalImages((imgs || []).map((i: any) => i.image_url));
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isAdditional = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      if (isAdditional) {
        setAdditionalImages(prev => [...prev, urlData.publicUrl]);
      } else {
        setForm(f => ({ ...f, image_url: urlData.publicUrl }));
      }
      toast({ title: "Image uploaded" });
    }
    setUploading(false);
    e.target.value = "";
  };

  const toggleColor = (c: string) => {
    setForm(f => ({
      ...f,
      colors: f.colors.includes(c) ? f.colors.filter(x => x !== c) : [...f.colors, c],
    }));
  };

  const addCustomColor = () => {
    if (customColor && /^#[0-9a-fA-F]{6}$/.test(customColor) && !form.colors.includes(customColor)) {
      setForm(f => ({ ...f, colors: [...f.colors, customColor] }));
      setCustomColor("");
    }
  };

  const toggleSize = (s: string) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s],
    }));
  };

  const addCustomSize = () => {
    if (customSize.trim() && !form.sizes.includes(customSize.trim())) {
      setForm(f => ({ ...f, sizes: [...f.sizes, customSize.trim()] }));
      setCustomSize("");
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Missing fields", description: "Name and price required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name, description: form.description || null,
      price: parseFloat(form.price), category: form.category,
      brand: form.brand || null,
      is_featured: form.is_featured, is_on_sale: form.is_on_sale,
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      image_url: form.image_url || null,
      colors: form.colors, sizes: form.sizes,
    };

    let productId = editProduct?.id;

    if (editProduct) {
      const { error } = await supabase.from("products").update(payload as any).eq("id", editProduct.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("products").insert(payload as any).select().single();
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
      productId = data.id;
    }

    if (productId) {
      await supabase.from("product_images").delete().eq("product_id", productId);
      if (additionalImages.length > 0) {
        await supabase.from("product_images").insert(
          additionalImages.map((url, i) => ({ product_id: productId, image_url: url, display_order: i }))
        );
      }
    }

    toast({ title: editProduct ? "Product updated" : "Product created" });
    setSaving(false);
    setDialogOpen(false);
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Product deleted" }); fetchProducts(); }
  };

  if (authLoading || loading) {
    return <AdminLayout title="Products"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Products">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground text-sm">{products.length} products</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-1"><Plus className="w-4 h-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-space">{editProduct ? "Edit Product" : "New Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Selling Price *</Label><Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Brand</Label><Input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. Nike" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Stock</Label><Input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Was Price <span className="text-[10px] text-muted-foreground">(Original / Crossed-out)</span></Label><Input type="number" step="0.01" value={form.sale_price} onChange={e => setForm(f => ({ ...f, sale_price: e.target.value }))} placeholder="e.g. 49.99" /></div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))} /><Label>Featured</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_on_sale} onCheckedChange={v => setForm(f => ({ ...f, is_on_sale: v }))} /><Label>On Sale</Label></div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>Available Colors</Label>
                <div className="flex gap-1.5 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${form.colors.includes(c) ? "border-primary ring-2 ring-primary/30 scale-110" : "border-white/20 hover:scale-105"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex gap-2 items-center mt-1">
                  <Input value={customColor} onChange={e => setCustomColor(e.target.value)} placeholder="#ff5733" className="w-32 h-8 text-xs" />
                  <Button type="button" size="sm" variant="outline" onClick={addCustomColor} className="h-8 text-xs">Add Color</Button>
                </div>
                {form.colors.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {form.colors.map((c, i) => (
                      <div key={i} className="flex items-center gap-1 bg-muted/50 rounded-full pl-1 pr-2 py-0.5">
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                        <span className="text-[10px]">{c}</span>
                        <button type="button" onClick={() => setForm(f => ({ ...f, colors: f.colors.filter((_, j) => j !== i) }))}>
                          <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <Label>Available Sizes</Label>
                <div className="flex gap-1.5 flex-wrap">
                  {PRESET_SIZES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${form.sizes.includes(s) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 items-center mt-1">
                  <Input value={customSize} onChange={e => setCustomSize(e.target.value)} placeholder="Custom size" className="w-32 h-8 text-xs" />
                  <Button type="button" size="sm" variant="outline" onClick={addCustomSize} className="h-8 text-xs">Add Size</Button>
                </div>
                {form.sizes.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {form.sizes.map((s, i) => (
                      <span key={i} className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-0.5 text-[10px]">
                        {s}
                        <button type="button" onClick={() => setForm(f => ({ ...f, sizes: f.sizes.filter((_, j) => j !== i) }))}>
                          <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Main image */}
              <div className="space-y-2">
                <Label>Main Image</Label>
                {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
                <div className="flex gap-2 items-center">
                  <Input type="file" accept="image/*" onChange={e => handleImageUpload(e)} disabled={uploading} />
                  {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>
              </div>
              {/* Additional images */}
              <div className="space-y-2">
                <Label>Additional Images</Label>
                <div className="grid grid-cols-3 gap-2">
                  {additionalImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-full h-20 object-cover rounded-lg" />
                      <button onClick={() => setAdditionalImages(prev => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                  <label className="w-full h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true)} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editProduct ? "Update" : "Create"} Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden sm:table-cell">Stock</TableHead>
              <TableHead className="hidden lg:table-cell">Variants</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No products yet.</TableCell></TableRow>
            ) : products.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-foreground" /></div>}
                </TableCell>
                <TableCell className="font-medium max-w-[150px] truncate">{p.name}</TableCell>
                <TableCell className="hidden md:table-cell">{p.category}</TableCell>
                <TableCell>
                  ${p.price.toFixed(2)}
                  {p.is_on_sale && p.sale_price && <span className="text-destructive ml-1 text-xs block">${p.sale_price.toFixed(2)}</span>}
                </TableCell>
                <TableCell className="hidden sm:table-cell">{p.stock_quantity}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex gap-1 items-center">
                    {p.colors.length > 0 && (
                      <div className="flex -space-x-1">
                        {p.colors.slice(0, 3).map((c, i) => (
                          <span key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                        ))}
                        {p.colors.length > 3 && <span className="text-[10px] text-muted-foreground ml-1">+{p.colors.length - 3}</span>}
                      </div>
                    )}
                    {p.sizes.length > 0 && <span className="text-[10px] text-muted-foreground">{p.sizes.length} sizes</span>}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {p.is_featured && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Featured</span>}
                    {p.is_on_sale && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">Sale</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

export default ProductsPage;
