import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader2, Globe, Monitor, Smartphone, Tablet, Eye, TrendingUp, Users, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const COLORS = ["hsl(200,100%,60%)", "hsl(270,100%,70%)", "hsl(180,100%,50%)", "hsl(340,80%,60%)", "hsl(45,100%,55%)", "hsl(120,60%,50%)"];

const AnalyticsPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"7d" | "30d" | "all">("7d");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchVisits = async () => {
      setLoading(true);
      let query = (supabase.from("page_visits") as any).select("*").order("created_at", { ascending: false });
      if (range === "7d") {
        const d = new Date(); d.setDate(d.getDate() - 7);
        query = query.gte("created_at", d.toISOString());
      } else if (range === "30d") {
        const d = new Date(); d.setDate(d.getDate() - 30);
        query = query.gte("created_at", d.toISOString());
      }
      const { data } = await query.limit(5000);
      setVisits(data || []);
      setLoading(false);
    };
    fetchVisits();
  }, [isAdmin, range]);

  // Compute stats
  const uniqueSessions = new Set(visits.map(v => v.session_id)).size;
  const pageViews = visits.length;

  // Page breakdown
  const pageMap: Record<string, number> = {};
  visits.forEach(v => { pageMap[v.page_path] = (pageMap[v.page_path] || 0) + 1; });
  const pageData = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }));

  // Device breakdown
  const deviceMap: Record<string, number> = {};
  visits.forEach(v => { deviceMap[v.device_type || "unknown"] = (deviceMap[v.device_type || "unknown"] || 0) + 1; });
  const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

  // Browser breakdown
  const browserMap: Record<string, number> = {};
  visits.forEach(v => { browserMap[v.browser || "Other"] = (browserMap[v.browser || "Other"] || 0) + 1; });
  const browserData = Object.entries(browserMap).map(([name, value]) => ({ name, value }));

  // Daily trend
  const dailyMap: Record<string, number> = {};
  visits.forEach(v => {
    const day = new Date(v.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });
  const dailyData = Object.entries(dailyMap).reverse().map(([date, views]) => ({ date, views }));

  const deviceIcon = (type: string) => {
    if (type === "mobile") return <Smartphone className="w-4 h-4" />;
    if (type === "tablet") return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  if (authLoading || loading) {
    return <AdminLayout title="Analytics"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Analytics">
      {/* Range selector */}
      <div className="flex gap-2 mb-6">
        {(["7d", "30d", "all"] as const).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${range === r ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
          >
            {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "All Time"}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Views", value: pageViews, icon: Eye, color: "text-primary" },
          { label: "Unique Visitors", value: uniqueSessions, icon: Users, color: "text-emerald-400" },
          { label: "Pages Tracked", value: Object.keys(pageMap).length, icon: Globe, color: "text-violet-400" },
          { label: "Avg Views/Day", value: dailyData.length > 0 ? Math.round(pageViews / dailyData.length) : 0, icon: TrendingUp, color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold font-space">{s.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Daily trend */}
        <div className="glass-card p-5">
          <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Daily Views</h3>
          <div className="h-64">
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, color: "hsl(var(--foreground))" }} />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No data yet</div>
            )}
          </div>
        </div>

        {/* Top pages */}
        <div className="glass-card p-5">
          <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Top Pages</h3>
          <div className="h-64">
            {pageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pageData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Device & Browser */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><Monitor className="w-4 h-4 text-primary" /> Devices</h3>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {deviceData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="flex items-center gap-1.5 text-sm capitalize">{deviceIcon(d.name)} {d.name}</span>
                  <span className="text-sm font-semibold ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold font-space mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Browsers</h3>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={browserData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {browserData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {browserData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-sm">{d.name}</span>
                  <span className="text-sm font-semibold ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
