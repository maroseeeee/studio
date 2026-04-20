
"use client";

import { useState, useMemo } from "react";
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
  X,
  Clock,
  User
} from "lucide-react";
import { mockAttendance } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
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
    from: new Date(2026, 2, 9), // March 9, 2026
    to: new Date(2026, 2, 15),   // March 15, 2026
  });
  const { toast } = useToast();

  const filteredLogs = useMemo(() => {
    return mockAttendance.filter(log => {
      const matchesSearch = log.volunteerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (date?.from) {
        const logDate = parseISO(log.date);
        const start = startOfDay(date.from);
        const end = date.to ? endOfDay(date.to) : endOfDay(date.from);
        
        matchesDate = isWithinInterval(logDate, { start, end });
      }
      
      return matchesSearch && matchesDate;
    });
  }, [searchTerm, date]);

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
      const rows = filteredLogs.map(log => [
        log.id, 
        log.volunteerName, 
        log.date, 
        log.checkIn, 
        log.checkOut || "Active", 
        log.duration || "N/A"
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.download = `attendance-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Attendance logs have been downloaded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "An error occurred while generating the CSV.",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDate(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline uppercase">Attendance Logs</h2>
          <p className="text-sm text-muted-foreground">History of activity for Dalaw Nazareno 2026</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleExport} 
          className="border-primary text-primary hover:bg-primary/5 h-12 rounded-xl w-full sm:w-auto"
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-6 border-b bg-muted/20">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search volunteer..."
                className="pl-10 h-11 rounded-xl bg-background border-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {(searchTerm || date) && (
              <Button variant="ghost" size="icon" onClick={clearFilters} className="h-11 w-11 shrink-0 rounded-xl">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full md:w-[320px] justify-start text-left font-normal h-11 rounded-xl bg-background border-none shadow-sm",
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
                    <span>Filter by date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl overflow-hidden" align="end">
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
          {/* Mobile View: Cards */}
          <div className="md:hidden divide-y">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 space-y-3 bg-card active:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-bold text-primary flex items-center gap-1">
                      <User className="h-3 w-3" /> {log.volunteerName}
                    </p>
                    <p className="text-xs text-muted-foreground">{format(parseISO(log.date), "MMM dd, yyyy")}</p>
                  </div>
                  <Badge variant={log.checkOut ? "secondary" : "default"} className={cn("rounded-md uppercase text-[9px] font-black tracking-widest", !log.checkOut ? "bg-primary animate-pulse" : "")}>
                    {log.checkOut ? "Closed" : "Active"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted/30 p-2 rounded-lg">
                    <p className="text-muted-foreground mb-1 uppercase text-[8px] font-bold">Check-In</p>
                    <p className="text-red-600 font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {log.checkIn}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-lg">
                    <p className="text-muted-foreground mb-1 uppercase text-[8px] font-bold">Check-Out</p>
                    <p className="text-red-800 font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {log.checkOut || "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Volunteer</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Date</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Check-In</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Check-Out</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Duration</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-primary/5 transition-colors group">
                    <TableCell className="font-bold text-primary">{log.volunteerName}</TableCell>
                    <TableCell className="text-muted-foreground">{format(parseISO(log.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="text-red-600 font-bold">{log.checkIn}</TableCell>
                    <TableCell className="text-red-800 font-bold">{log.checkOut || "—"}</TableCell>
                    <TableCell className="font-medium">{log.duration || "Active"}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={log.checkOut ? "secondary" : "default"} className={cn("rounded-md uppercase text-[10px] font-black tracking-widest px-2", !log.checkOut ? "bg-primary animate-pulse" : "")}>
                        {log.checkOut ? "Closed" : "Active"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-24 text-muted-foreground bg-muted/5">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Filter className="h-6 w-6 opacity-30" />
                </div>
                <p className="font-medium">No activity records match your filters</p>
                <Button variant="link" onClick={clearFilters} className="text-primary font-bold">Clear all filters</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
