
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
import { 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  ChevronRight
} from "lucide-react";
import { mockAttendance } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2026, 2, 10),
    to: new Date(2026, 2, 12),
  });
  const { toast } = useToast();

  const filteredLogs = mockAttendance.filter(log => {
    const matchesSearch = log.volunteerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // In a real app, we'd filter by date object here
    // For this prototype, we'll keep it simple and just filter by name
    return matchesSearch;
  });

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      toast({
        variant: "destructive",
        title: "No data to export",
        description: "There are no logs matching your current filters.",
      });
      return;
    }

    try {
      const headers = ["ID", "Volunteer Name", "Date", "Check-In", "Check-Out", "Duration"];
      const csvRows = [
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
      ];
      
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute("download", `attendance-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Attendance logs have been downloaded as CSV.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "An error occurred while generating the CSV.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary font-headline">Attendance Logs</h2>
          <p className="text-muted-foreground">Full history of volunteer activity</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="border-primary text-primary hover:bg-primary/5">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-6 border-b">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by volunteer name..."
                className="pl-8 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full md:w-[300px] justify-start text-left font-normal h-10",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-none border-x-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-bold">Volunteer</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Check-In</TableHead>
                  <TableHead className="font-bold">Check-Out</TableHead>
                  <TableHead className="font-bold">Duration</TableHead>
                  <TableHead className="text-right font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-semibold text-primary">{log.volunteerName}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell className="text-red-600 font-medium">{log.checkIn}</TableCell>
                    <TableCell className="text-red-800 font-medium">{log.checkOut || "—"}</TableCell>
                    <TableCell>{log.duration || "Active"}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={log.checkOut ? "secondary" : "default"} className={cn("rounded-md uppercase text-[10px] tracking-wider", !log.checkOut ? "bg-primary" : "")}>
                        {log.checkOut ? "Completed" : "On Duty"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 opacity-20" />
                        <p>No logs found for the search criteria</p>
                      </div>
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
