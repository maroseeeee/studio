
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Download, 
  MoreVertical, 
  UserPlus, 
  QrCode as QrIcon,
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
import { Badge } from "@/components/ui/badge";
import { mockVolunteers, Volunteer } from "@/lib/data";

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVol: Volunteer = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      qrCode: `VOL-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setVolunteers([...volunteers, newVol]);
    setIsRegisterOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary font-headline">Volunteers</h2>
          <p className="text-muted-foreground">Manage and register event volunteers</p>
        </div>
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" /> Register New Volunteer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleRegister}>
              <DialogHeader>
                <DialogTitle>Register Volunteer</DialogTitle>
                <DialogDescription>
                  Enter details to generate a unique QR code for attendance.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="09XX-XXX-XXXX" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" name="role" placeholder="e.g. Security, Medical" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-primary">Create Profile & QR</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search volunteers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>QR ID</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.map((vol) => (
                  <TableRow key={vol.id}>
                    <TableCell className="font-medium">{vol.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{vol.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {vol.email}<br/>{vol.phone}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{vol.qrCode}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedVolunteer(vol)}
                      >
                        <QrIcon className="h-4 w-4 text-accent" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* QR Display Dialog */}
      <Dialog open={!!selectedVolunteer} onOpenChange={(open) => !open && setSelectedVolunteer(null)}>
        <DialogContent className="sm:max-w-md flex flex-col items-center">
          <DialogHeader className="text-center w-full">
            <DialogTitle>Volunteer QR Code</DialogTitle>
            <DialogDescription>
              Official ID for {selectedVolunteer?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 bg-white rounded-xl shadow-inner my-4 flex items-center justify-center">
            {/* Simple simulated QR code using a div pattern for visual appeal */}
            <div className="w-48 h-48 bg-black relative p-2">
              <div className="absolute top-2 left-2 w-12 h-12 border-4 border-white"></div>
              <div className="absolute top-2 right-2 w-12 h-12 border-4 border-white"></div>
              <div className="absolute bottom-2 left-2 w-12 h-12 border-4 border-white"></div>
              <div className="grid grid-cols-8 grid-rows-8 gap-0.5 w-full h-full p-2">
                 {Array.from({length: 64}).map((_, i) => (
                   <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                 ))}
              </div>
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="font-bold text-lg font-headline">{selectedVolunteer?.qrCode}</p>
            <p className="text-sm text-muted-foreground">Scan to check in or out</p>
          </div>
          <DialogFooter className="w-full sm:justify-center gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button className="flex-1 bg-primary">
              Print Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
