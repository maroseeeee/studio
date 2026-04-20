
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
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

const ALL_ROLES = [
  "Responsible Official",
  "Incident Commander",
  "Planning Section Chief",
  "Operations Section Chief",
  "Finance and Admin Section Chief",
  "Logistics and Facilities Section Chief",
  "Secretariat",
  "Documentation",
  "Finance",
  "Food & Services",
  "Logistics & Facilities",
  "Liturgy",
  "Programs",
  "Pilgrim Assistance",
  "Safety & Security",
  "Health & Emergency Response",
  "Volunteer Management"
];

const COLORS = [
  "#8C3B67", "#D033B6", "#7f1d1d", "#dc2626", "#ef4444", 
  "#f87171", "#991b1b", "#450a0a", "#7c2d12", "#9a3412",
  "#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74"
];

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
      const headers = ["Section", "Count"];
      const rows = ALL_ROLES.map(role => [role, 0]);

      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `distribution-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

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
          <h2 className="text-3xl font-bold text-primary font-headline uppercase">Reporting & Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into Volunteer operations</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90 rounded-xl h-12" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Service Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">0h</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              No data available
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Peak Attendance Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">--:--</div>
            <p className="text-xs text-muted-foreground mt-1">No activity logged</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">0</div>
            <p className="text-xs text-muted-foreground mt-1">Pending data</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-none shadow-sm h-[500px] flex flex-col">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Volunteer Distribution</CardTitle>
          </CardHeader>
          <div className="flex-1 w-full mt-4 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-muted/5 text-center p-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium italic">No distribution data available to visualize.</p>
            <p className="text-xs text-muted-foreground mt-1">Begin registering volunteers to see charts.</p>
          </div>
        </Card>

        <Card className="p-6 bg-card border-none shadow-sm h-[500px] flex flex-col">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Role Distribution Summary</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-primary font-bold">
              <Link href="/logs">
                <FileText className="h-4 w-4 mr-2" /> Full Details
              </Link>
            </Button>
          </CardHeader>
          
          <ScrollArea className="flex-1 -mr-2 pr-4 mt-4">
            <div className="space-y-4">
              {ALL_ROLES.map((role, idx) => (
                <div key={role} className="space-y-2">
                  <div className="flex justify-between text-sm items-center">
                    <span className="font-medium text-muted-foreground truncate mr-2">{role}</span>
                    <span className="font-black text-primary bg-primary/5 px-2 py-0.5 rounded text-xs">0</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full opacity-30" 
                      style={{ 
                        width: '0%',
                        backgroundColor: COLORS[idx % COLORS.length]
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-4 pt-4 border-t shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              System generated on {reportDate}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
