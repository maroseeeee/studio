
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, QrCode, Clock, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  {
    label: "Total Volunteers",
    value: "152",
    icon: Users,
    color: "text-primary",
  },
  {
    label: "Checked In Today",
    value: "45",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  {
    label: "Average Duration",
    value: "6.5h",
    icon: Clock,
    color: "text-accent",
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
      <div>
        <h2 className="text-3xl font-bold text-primary font-headline">Overview</h2>
        <p className="text-muted-foreground">Welcome to Dalaw Nazareno 2026 Attendance Hub</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-card hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-none shadow-sm">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-headline">Weekly Attendance Trends</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-card border-none shadow-sm">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-headline">Recent Activity</CardTitle>
          </CardHeader>
          <div className="space-y-4 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 text-sm border-b pb-3 last:border-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Volunteer #{i + 1000} Checked In</p>
                  <p className="text-muted-foreground text-xs">Today at {8 + i}:15 AM</p>
                </div>
                <div className="text-xs font-semibold text-accent">Gate {i}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
