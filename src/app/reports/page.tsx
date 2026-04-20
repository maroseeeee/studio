"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Download, FileText, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleData = [
  { name: "Safety & Security", value: 45 },
  { name: "Health & Emergency Response", value: 30 },
  { name: "Logistics & Facilities", value: 25 },
  { name: "Incident Command", value: 15 },
  { name: "Volunteer Management", value: 37 },
];

const COLORS = ["#991b1b", "#dc2626", "#f87171", "#7f1d1d", "#ef4444"];

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [reportDate, setReportDate] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    setReportDate(new Date().toLocaleDateString());
  }, []);

  const handleExport = () => {
    try {
      const headers = ["Section", "Count", "Percentage"];
      const total = roleData.reduce((acc, curr) => acc + curr.value, 0);
      
      const rows = roleData.map(item => [
        item.name,
        item.value,
        `${((item.value / total) * 100).toFixed(1)}%`
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `distribution-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "The distribution report has been downloaded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not generate the CSV file.",
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary font-headline">Reporting & Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into Volunteer operations</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Service Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2,485h</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peak Attendance Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">09:00 AM</div>
            <p className="text-xs text-muted-foreground mt-1">Average over last 7 days</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Turnover Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">94%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Retention is high
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-none shadow-sm">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-headline">Volunteer Distribution by Section</CardTitle>
          </CardHeader>
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-card border-none shadow-sm">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-headline">Summary Data</CardTitle>
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4 mr-2" /> Full Details
            </Button>
          </CardHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Safety & Security Deployment</span>
                <span className="font-bold">45 / 50</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Health & Emergency Station</span>
                <span className="font-bold">12 / 12</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pilgrim Assistance</span>
                <span className="font-bold">28 / 40</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full opacity-60" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Volunteer Management</span>
                <span className="font-bold">8 / 15</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full opacity-50" style={{ width: '53%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Analytics generated on {reportDate}. Data is refreshed every 5 minutes.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
