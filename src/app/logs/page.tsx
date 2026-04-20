
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Filter, Download, Calendar as CalendarIcon } from "lucide-react";
import { mockAttendance } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredLogs = mockAttendance.filter(log => 
    log.volunteerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      toast({
        variant: "destructive",
        title: "No data to export",
        description: "There are no logs matching your current filters.",
      });
      return;
    }

    const headers = ["ID", "Volunteer Name", "Date", "Check-In", "Check-Out", "Duration"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => 
        [
          log.id, 
          `"${log.volunteerName}"`, 
          log.date, 
          log.checkIn, 
          log.checkOut || "Active", 
          log.duration || "N/A"
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: "Attendance logs have been downloaded as CSV.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary font-headline">Attendance Logs</h2>
          <p className="text-muted-foreground">Full history of volunteer activity</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by volunteer name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-md">
            <CalendarIcon className="h-4 w-4" />
            March 10, 2026 - March 12, 2026
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volunteer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-In</TableHead>
                  <TableHead>Check-Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.volunteerName}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell className="text-red-600 font-medium">{log.checkIn}</TableCell>
                    <TableCell className="text-red-800 font-medium">{log.checkOut || "—"}</TableCell>
                    <TableCell>{log.duration || "Active"}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={log.checkOut ? "secondary" : "default"} className={!log.checkOut ? "bg-primary" : ""}>
                        {log.checkOut ? "Completed" : "On Duty"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No logs found for the search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
