import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Package, ShoppingCart, DollarSign, TrendingUp, Users, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

const COLORS = ["hsl(200,100%,60%)", "hsl(180,100%,50%)", "hsl(270,100%,70%)", "hsl(0,84%,60%)", "hsl(45,100%,50%)"];

const DashboardPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 });
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const [{ count: pCount }, { data: orders }, { data: products }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("category"),
      ]);

      const orderList = (orders || []) as any[];
      const revenue = orderList.reduce((s: number, o: any) => s + Number(o.total_amount), 0);
      const uniqueEmails = new Set(orderList.map((o: any) => o.customer_email));

      setStats({ products: pCount || 0, orders: orderList.length, revenue, customers: uniqueEmails.size });

      // Category distribution
      const catMap: Record<string, number> = {};
      (products || []).forEach((p: any) => { catMap[p.category || "General"] = (catMap[p.category || "General"] || 0) + 1; });
      setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

      // Revenue over time (last 7 days)
      const days: Record<string, { revenue: number; orders: number }> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        days[key] = { revenue: 0, orders: 0 };
      }
      orderList.forEach((o: any) => {
        const key = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (days[key]) { days[key].revenue += Number(o.total_amount); days[key].orders += 1; }
      });
      setRevenueData(Object.entries(days).map(([date, d]) => ({ date, ...d })));

      setLoading(false);
    };
    fetchData();
  }, [isAdmin]);

  if (authLoading || loading) {
    return <AdminLayout title="Dashboard"><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  const statCards = [
    { label: "Products", value: stats.products, icon: Package, color: "text-primary" },
    { label: "Orders", value: stats.orders, icon: ShoppingCart, color: "text-accent" },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "text-secondary" },
    { label: "Customers", value: stats.customers, icon: Users, color: "text-primary" },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold font-space">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold font-space mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Revenue (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200,100%,60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(200,100%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,32%,17%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215,20%,65%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(215,20%,65%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(222,84%,5%)", border: "1px solid hsl(217,32%,17%)", borderRadius: "8px", color: "#fff" }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(200,100%,60%)" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold font-space mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-accent" /> Products by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(222,84%,5%)", border: "1px solid hsl(217,32%,17%)", borderRadius: "8px", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders chart */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold font-space mb-4 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-secondary" /> Orders (7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,32%,17%)" />
            <XAxis dataKey="date" tick={{ fill: "hsl(215,20%,65%)", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(215,20%,65%)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "hsl(222,84%,5%)", border: "1px solid hsl(217,32%,17%)", borderRadius: "8px", color: "#fff" }} />
            <Bar dataKey="orders" fill="hsl(180,100%,50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
