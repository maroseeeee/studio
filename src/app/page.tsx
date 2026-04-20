
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, QrCode, Clock, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  {
    label: "Volunteers",
    value: "0",
    icon: Users,
    color: "text-primary",
  },
  {
    label: "Active Now",
    value: "0",
    icon: CheckCircle2,
    color: "text-primary",
  },
  {
    label: "Avg Hours",
    value: "0h",
    icon: Clock,
    color: "text-primary",
  },
  {
    label: "Active Zones",
    value: "0",
    icon: QrCode,
    color: "text-primary",
  },
];

const data = [
  { name: "Mar 09 (Mon)", count: 0 },
  { name: "Mar 10 (Tue)", count: 0 },
  { name: "Mar 11 (Wed)", count: 0 },
  { name: "Mar 12 (Thu)", count: 0 },
  { name: "Mar 13 (Fri)", count: 0 },
  { name: "Mar 14 (Sat)", count: 0 },
  { name: "Mar 15 (Sun)", count: 0 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary font-headline uppercase tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Dalaw Nazareno 2026 Real-time Overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-card hover:bg-primary/5 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-primary transition-colors">{stat.label}</CardTitle>
              <stat.icon className={`h-3 w-3 md:h-4 md:w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl md:text-2xl font-bold text-primary">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-card border-none shadow-sm">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Volunteer Turnout (Event Week)</CardTitle>
        </CardHeader>
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                interval={0}
                tickFormatter={(value) => value.split(' ')[1]} // Show only date on mobile
              />
              <YAxis 
                fontSize={10} 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 bg-card border-none shadow-sm">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Recent Check-ins</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="text-center py-12 text-muted-foreground text-sm flex flex-col items-center gap-2">
            <CheckCircle2 className="h-8 w-8 opacity-10" />
            No recent check-ins recorded
          </div>
        </div>
      </Card>
    </div>
  );
}
