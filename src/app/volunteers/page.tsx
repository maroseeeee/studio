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
  Phone
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [qrPattern, setQrPattern] = useState<boolean[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setQrPattern(Array.from({ length: 64 }, () => Math.random() > 0.5));
  }, [selectedVolunteer]);

  const filteredVolunteers = mockVolunteers.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    toast({
      title: "Volunteer Registered",
      description: `${formData.get('name')} has been successfully added to the roster.`,
    });
    setIsRegisterOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary font-headline">Volunteer Roster</h2>
          <p className="text-muted-foreground">Manage and identify PSN personnel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none">
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Register Volunteer</DialogTitle>
                <DialogDescription>
                  Enter the details for the new volunteer. They will be assigned a unique QR ID.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRegisterSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Juan Luna" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" defaultValue="Safety & Security">
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent side="bottom" sideOffset={12} position="popper" className="z-[100]">
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="09XX-XXX-XXXX" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="email@example.com" />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Complete Registration</Button>
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
              className="pl-10 h-12 bg-muted/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="md:hidden space-y-px bg-border">
            {filteredVolunteers.map((vol) => (
              <div key={vol.id} className="bg-card p-4 flex items-center justify-between active:bg-muted/50 transition-colors" onClick={() => setSelectedVolunteer(vol)}>
                <div className="space-y-1">
                  <p className="font-bold text-primary">{vol.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">{vol.role}</Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">{vol.qrCode}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <QrIcon className="h-5 w-5 text-accent" />
                </Button>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px]">Volunteer</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>ID Code</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.map((vol) => (
                  <TableRow key={vol.id} className="group cursor-pointer" onClick={() => setSelectedVolunteer(vol)}>
                    <TableCell className="font-medium text-primary">{vol.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-semibold">{vol.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {vol.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {vol.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold">{vol.qrCode}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="group-hover:text-primary">
                        <QrIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredVolunteers.length === 0 && (
            <div className="text-center py-20 text-muted-foreground bg-muted/5">
              <p>No volunteers found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedVolunteer} onOpenChange={(open) => !open && setSelectedVolunteer(null)}>
        <DialogContent className="sm:max-w-md flex flex-col items-center">
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
          <div className="text-center space-y-1 mb-4">
            <Badge className="bg-primary text-white text-lg px-4 py-1 font-mono tracking-widest rounded-xl">
              {selectedVolunteer?.qrCode}
            </Badge>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter mt-2">
              Assigned Role: {selectedVolunteer?.role}
            </p>
          </div>
          <DialogFooter className="w-full sm:justify-center gap-2">
            <Button variant="outline" className="flex-1 h-12 rounded-xl">
              <Download className="mr-2 h-4 w-4" /> Save ID
            </Button>
            <Button className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90">
              Print Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
