
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, QrCode, Clock, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  {
    label: "Volunteers",
    value: "152",
    icon: Users,
    color: "text-primary",
  },
  {
    label: "Active Now",
    value: "45",
    icon: CheckCircle2,
    color: "text-primary",
  },
  {
    label: "Avg Hours",
    value: "6.5h",
    icon: Clock,
    color: "text-primary",
  },
  {
    label: "Active Zones",
    value: "8",
    icon: QrCode,
    color: "text-primary",
  },
];

// March 10, 2026 is a Tuesday
const data = [
  { name: "Mar 09 (Mon)", count: 40 },
  { name: "Mar 10 (Tue)", count: 85 },
  { name: "Mar 11 (Wed)", count: 120 },
  { name: "Mar 12 (Thu)", count: 110 },
  { name: "Mar 13 (Fri)", count: 70 },
  { name: "Mar 14 (Sat)", count: 45 },
  { name: "Mar 15 (Sun)", count: 30 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary font-headline uppercase tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Dalaw Nazareno 2026 Real-time Overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-card hover:bg-primary/5 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-primary transition-colors">{stat.label}</CardTitle>
              <stat.icon className={`h-3 w-3 ${stat.color}`} />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl font-bold text-primary">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-card border-none shadow-sm">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Volunteer Turnout (Event Week)</CardTitle>
        </CardHeader>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
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
          {[
            { id: 1024, name: "Juan Dela Cruz", time: "10:15 AM", gate: "North Gate" },
            { id: 1025, name: "Maria Clara", time: "10:18 AM", gate: "East Gate" },
            { id: 1026, name: "Jose Rizal", time: "10:22 AM", gate: "Main Entrance" },
            { id: 1027, name: "Andres Bonifacio", time: "10:25 AM", gate: "Plaza" }
          ].map((entry) => (
            <div key={entry.id} className="flex items-center gap-4 text-sm border-b pb-3 last:border-0 last:pb-0">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{entry.name}</p>
                <p className="text-muted-foreground text-[10px]">Today at {entry.time}</p>
              </div>
              <div className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-1 rounded-md">{entry.gate}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
