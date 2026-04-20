
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Download, 
  QrCode as QrIcon, 
  UserPlus,
  Mail,
  Phone,
  Printer,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockVolunteers, Volunteer } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const roles = [
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

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [qrPattern, setQrPattern] = useState<boolean[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedVolunteer) {
      setQrPattern(Array.from({ length: 64 }, () => Math.random() > 0.5));
    }
  }, [selectedVolunteer]);

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    if (filteredVolunteers.length === 0) {
      toast({
        variant: "destructive",
        title: "No data to export",
        description: "There are no volunteers matching your search.",
      });
      return;
    }

    try {
      const headers = ["ID", "Name", "Email", "Phone", "Role", "QR Code"];
      const csvContent = [
        headers.join(","),
        ...filteredVolunteers.map(v => 
          [v.id, `"${v.name}"`, v.email, v.phone, `"${v.role}"`, v.qrCode].join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `volunteer-roster-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Volunteer roster has been downloaded as CSV.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not generate CSV file.",
      });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    
    const newId = Math.random().toString(36).substring(2, 9);
    const newVolunteer: Volunteer = {
      id: newId,
      name,
      role,
      email,
      phone,
      qrCode: `VOL-${1000 + volunteers.length + 1}`
    };

    setVolunteers(prev => [newVolunteer, ...prev]);
    
    toast({
      title: "Volunteer Registered",
      description: `${name} has been successfully added to the roster.`,
    });
    setIsRegisterOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary font-headline">Volunteer Roster</h2>
          <p className="text-muted-foreground">Manage and identify personnel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none h-12 rounded-xl" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none h-12 rounded-xl">
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-headline text-primary">Register Volunteer</DialogTitle>
                <DialogDescription>
                  Enter details for the new volunteer. A unique ID will be auto-generated.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRegisterSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Juan Luna" required className="h-11" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" defaultValue="Safety & Security">
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent side="bottom" sideOffset={12} className="z-[100] max-h-[300px]">
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="09XX-XXX-XXXX" className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="email@example.com" className="h-11" />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl">Complete Registration</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card">
        <CardHeader className="pb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or role..."
              className="pl-10 h-12 bg-muted/30 border-none rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="md:hidden space-y-px bg-border">
            {filteredVolunteers.map((vol) => (
              <div 
                key={vol.id} 
                className="bg-card p-4 flex items-center justify-between active:bg-muted/50 transition-colors cursor-pointer" 
                onClick={() => setSelectedVolunteer(vol)}
              >
                <div className="space-y-1">
                  <p className="font-bold text-primary">{vol.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase rounded-md">{vol.role}</Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">{vol.qrCode}</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVolunteer(vol);
                  }}
                >
                  <QrIcon className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px] font-bold text-xs uppercase tracking-wider">Volunteer</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Role</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Contact Info</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">ID Code</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.map((vol) => (
                  <TableRow 
                    key={vol.id} 
                    className="group cursor-pointer hover:bg-primary/5 transition-colors" 
                    onClick={() => setSelectedVolunteer(vol)}
                  >
                    <TableCell className="font-bold text-primary">{vol.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-semibold rounded-md">{vol.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground space-y-1">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {vol.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {vol.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold">{vol.qrCode}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVolunteer(vol);
                        }}
                      >
                        <QrIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredVolunteers.length === 0 && (
            <div className="text-center py-24 text-muted-foreground bg-muted/5">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-10" />
              <p className="font-medium">No volunteers found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedVolunteer} onOpenChange={(open) => !open && setSelectedVolunteer(null)}>
        <DialogContent className="sm:max-w-md flex flex-col items-center rounded-3xl p-8">
          <DialogHeader className="text-center w-full">
            <DialogTitle className="text-2xl font-headline text-primary">Volunteer ID</DialogTitle>
            <DialogDescription className="font-medium">
              Official Credential for {selectedVolunteer?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 bg-white rounded-2xl shadow-xl my-6 flex items-center justify-center border-4 border-primary/20">
            <div className="w-48 h-48 bg-black relative p-2 rounded-lg">
              <div className="absolute top-2 left-2 w-12 h-12 border-4 border-white rounded-tl-md"></div>
              <div className="absolute top-2 right-2 w-12 h-12 border-4 border-white rounded-tr-md"></div>
              <div className="absolute bottom-2 left-2 w-12 h-12 border-4 border-white rounded-bl-md"></div>
              <div className="grid grid-cols-8 grid-rows-8 gap-0.5 w-full h-full p-2">
                 {qrPattern.map((isActive, i) => (
                   <div key={i} className={`bg-white rounded-[1px] ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                 ))}
              </div>
            </div>
          </div>
          <div className="text-center space-y-1 mb-6">
            <Badge className="bg-primary text-white text-lg px-6 py-2 font-mono tracking-widest rounded-xl shadow-lg shadow-primary/20">
              {selectedVolunteer?.qrCode}
            </Badge>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-4">
              ROLE: {selectedVolunteer?.role}
            </p>
          </div>
          <DialogFooter className="w-full grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-xl" onClick={() => toast({ title: "Feature coming soon", description: "Save to device will be available in the full version." })}>
              <Download className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl shadow-md" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
