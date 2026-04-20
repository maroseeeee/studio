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

const data = [
  { name: "Mon", count: 40 },
  { name: "Tue", count: 30 },
  { name: "Wed", count: 55 },
  { name: "Thu", count: 45 },
  { name: "Fri", count: 70 },
  { name: "Sat", count: 90 },
  { name: "Sun", count: 85 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary font-headline">Dashboard</h2>
        <p className="text-sm text-muted-foreground">PSN Live Updates</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-card hover:bg-primary/5 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{stat.label}</CardTitle>
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
          <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Daily Attendance</CardTitle>
        </CardHeader>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 bg-card border-none shadow-sm">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 text-sm border-b pb-3 last:border-0 last:pb-0">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">Volunteer #{1000 + i} In</p>
                <p className="text-muted-foreground text-[10px]">Today at {8 + i}:15 AM</p>
              </div>
              <div className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-1 rounded">Gate {i}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}