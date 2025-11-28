import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { ShieldCheck, AlertOctagon, FileLock, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyAnalytics } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["weeklyAnalytics"],
    queryFn: getWeeklyAnalytics,
  });

  const weeklyData = data?.weeklyData || [];
  const categoryData = data?.categoryData || [];

  // Calculate stats
  const totalThreat = weeklyData.reduce((sum, d) => sum + d.toxic, 0);
  const totalScanned = weeklyData.reduce((sum, d) => sum + d.toxic + d.safe, 0);
  const safetyScore = totalScanned > 0 
    ? Math.round(((totalScanned - totalThreat) / totalScanned) * 100)
    : 100;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-heading font-bold mb-2">Safety Dashboard</h1>
        <p className="text-muted-foreground">Your digital safety overview for the past 7 days.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Threats Blocked" 
          value={totalThreat.toString()} 
          sub="This week" 
          icon={<AlertOctagon className="h-4 w-4 text-red-400" />} 
        />
        <StatCard 
          title="Messages Scanned" 
          value={totalScanned.toLocaleString()} 
          sub={totalScanned > 0 ? "Real-time protection" : "No data yet"} 
          icon={<Activity className="h-4 w-4 text-blue-400" />} 
        />
        <StatCard 
          title="Evidence Saved" 
          value="0" 
          sub="Encrypted locally" 
          icon={<FileLock className="h-4 w-4 text-purple-400" />} 
        />
        <StatCard 
          title="Safety Score" 
          value={`${safetyScore}%`} 
          sub={safetyScore > 80 ? "High Protection" : "Moderate"} 
          icon={<ShieldCheck className="h-4 w-4 text-green-400" />} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-panel border-0">
          <CardHeader>
            <CardTitle>Weekly Exposure Levels</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorToxic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="safe" stroke="#a78bfa" fillOpacity={1} fill="url(#colorSafe)" />
                    <Area type="monotone" dataKey="toxic" stroke="#f87171" fillOpacity={1} fill="url(#colorToxic)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 glass-panel border-0">
          <CardHeader>
            <CardTitle>Harm Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : categoryData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f1b2e', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Bar dataKey="value" fill="#a78bfa" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No harmful content detected yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: any }) {
  return (
    <Card className="glass-panel border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {sub}
        </p>
      </CardContent>
    </Card>
  )
}
