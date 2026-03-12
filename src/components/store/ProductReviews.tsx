import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Send, Loader2, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { ProductReview } from "@/types/product";

interface Props {
  productId: string;
}

const StarRating = ({ rating, size = 16, interactive = false, onChange }: {
  rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void;
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => onChange?.(i)}
        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
      >
        <Star
          style={{ width: size, height: size }}
          className={`transition-colors ${i <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      </button>
    ))}
  </div>
);

export const AverageStars = ({ productId, compact = false }: { productId: string; compact?: boolean }) => {
  const [avg, setAvg] = useState(5);
  const [count, setCount] = useState(0);

  useEffect(() => {
    supabase.from("product_reviews").select("rating").eq("product_id", productId).then(({ data }) => {
      if (data && data.length > 0) {
        setAvg(data.reduce((s, r) => s + r.rating, 0) / data.length);
        setCount(data.length);
      }
    });
  }, [productId]);

  return (
    <div className="flex items-center gap-1.5">
      <StarRating rating={Math.round(avg)} size={compact ? 12 : 14} />
      {!compact && (
        <span className="text-xs text-muted-foreground">
          {count > 0 ? `${avg.toFixed(1)} (${count})` : "No reviews yet"}
        </span>
      )}
    </div>
  );
};

const ProductReviews = ({ productId }: Props) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rating: 5, comment: "" });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setReviews((data as ProductReview[]) || []);
    setLoading(false);
  };

  const avg = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 5;

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.rating) {
      toast({ title: "Please fill name, email, and rating", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      customer_name: form.name,
      customer_email: form.email,
      rating: form.rating,
      comment: form.comment || null,
    });
    if (error) {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } else {
      toast({ title: "Review submitted! Thank you." });
      setForm({ name: "", email: "", rating: 5, comment: "" });
      setShowForm(false);
      fetchReviews();
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-space">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={Math.round(avg)} size={20} />
            <span className="text-sm text-muted-foreground">
              {reviews.length > 0 ? `${avg.toFixed(1)} out of 5 · ${reviews.length} review${reviews.length !== 1 ? "s" : ""}` : "No reviews yet — be the first!"}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <MessageSquare className="w-4 h-4" /> Write Review
        </Button>
      </div>

      {/* Review form */}
      {showForm && (
        <div className="glass-card p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Rating *</Label>
            <StarRating rating={form.rating} size={28} interactive onChange={r => setForm(f => ({ ...f, rating: r }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Comment</Label>
            <Textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} placeholder="Share your experience..." rows={3} />
          </div>
          <Button onClick={handleSubmit} disabled={submitting} className="gap-1">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Review
          </Button>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">{[1, 2].map(i => <div key={i} className="glass-card h-24 animate-pulse" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <StarRating rating={5} size={24} />
          <p className="text-muted-foreground mt-2 text-sm">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="glass-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{r.customer_name}</p>
                  <StarRating rating={r.rating} size={14} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                  {r.is_verified_purchase && (
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">Verified</span>
                  )}
                </div>
              </div>
              {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
