"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Scan, 
  CheckCircle, 
  LogOut, 
  History, 
  X,
  Camera,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function ScanningPage() {
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [lastScan, setLastScan] = useState<{name: string, type: 'In' | 'Out', time: string} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!isScanning) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        setHasCameraPermission(true);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
        setIsScanning(false);
      }
    };

    getCameraPermission();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning, toast]);

  const handleManualEntry = () => {
    if (!manualCode) return;
    processScan(manualCode);
  };

  const processScan = (code: string) => {
    // Mock processing logic
    const mockNames = ["Juan Dela Cruz", "Maria Clara", "Jose Rizal", "Andres Bonifacio"];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const isCheckIn = Math.random() > 0.5;
    
    const scanResult = {
      name: randomName,
      type: isCheckIn ? 'In' as const : 'Out' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLastScan(scanResult);
    toast({
      title: `Scan Successful: Check-${scanResult.type}`,
      description: `${scanResult.name} recorded successfully.`,
    });
    setManualCode("");
  };

  return (
    <div className="max-w-md mx-auto space-y-6 flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary font-headline">Scanner</h2>
        <p className="text-sm text-muted-foreground">Scan QR codes for check-in/out</p>
      </div>

      <Card className="overflow-hidden border-none shadow-xl bg-card flex-1 flex flex-col">
        <div className="aspect-square bg-black flex flex-col items-center justify-center relative overflow-hidden">
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${isScanning ? 'block' : 'hidden'}`} 
            autoPlay 
            muted 
            playsInline
          />
          
          {!isScanning && (
            <div className="text-center space-y-4 p-8">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Camera className="w-12 h-12 text-primary" />
              </div>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white w-full h-12 text-lg rounded-xl"
                onClick={() => setIsScanning(true)}
              >
                Launch Scanner
              </Button>
            </div>
          )}

          {isScanning && (
            <>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary/50 rounded-2xl relative">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary shadow-[0_0_15px_hsl(var(--primary))] animate-pulse"></div>
                  {/* Scanning Corners */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-4 right-4 z-10 rounded-full h-10 w-10"
                onClick={() => setIsScanning(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-medium text-xs bg-black/70 px-6 py-2 rounded-full backdrop-blur-md z-10 whitespace-nowrap">
                Focus on QR code
              </div>
            </>
          )}
        </div>

        {isScanning && hasCameraPermission === false && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Enable camera in settings to use the scanner.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="p-6 mt-auto">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-card px-3 text-muted-foreground">Manual Verification</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="ID (e.g. VOL-1001)" 
                value={manualCode}
                className="h-12 text-lg"
                onChange={(e) => setManualCode(e.target.value)}
              />
              <Button 
                className="bg-primary h-12 px-6" 
                onClick={handleManualEntry}
                disabled={!manualCode}
              >
                Verify
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {lastScan && (
        <Alert className="bg-primary/5 border-primary/20 animate-in slide-in-from-bottom-2 duration-300">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-bold">Confirmed</AlertTitle>
          <AlertDescription className="text-foreground/80">
            <strong>{lastScan.name}</strong> • Check-{lastScan.type} • {lastScan.time}
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="py-4">
          <CardTitle className="text-sm flex items-center gap-2 font-headline uppercase tracking-wider text-muted-foreground">
            <History className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <div className="divide-y">
             {[
               { name: "Andres Bonifacio", type: "In", time: "10:45 AM" },
               { name: "Jose Rizal", type: "Out", time: "10:30 AM" }
             ].map((scan, i) => (
               <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition">
                 <div className="space-y-0.5">
                   <p className="font-semibold text-sm">{scan.name}</p>
                   <p className="text-[10px] text-muted-foreground">{scan.time}</p>
                 </div>
                 <Badge variant={scan.type === 'In' ? 'default' : 'secondary'} className={`rounded-md px-2 py-0.5 text-[10px] uppercase ${scan.type === 'In' ? 'bg-primary' : ''}`}>
                   {scan.type === 'In' ? 'Check In' : 'Check Out'}
                 </Badge>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
