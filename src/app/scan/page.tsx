
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
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
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

  const handleScan = (code: string) => {
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
      title: `Success: Check-${scanResult.type}`,
      description: `${scanResult.name} recorded at ${scanResult.time}`,
    });
    setManualCode("");
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary font-headline">Attendance Scanner</h2>
        <p className="text-muted-foreground">Scan volunteer QR code to record attendance</p>
      </div>

      <Card className="overflow-hidden border-none shadow-lg bg-card">
        <div className="aspect-square bg-black flex flex-col items-center justify-center relative">
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${isScanning ? 'block' : 'hidden'}`} 
            autoPlay 
            muted 
            playsInline
          />
          
          {!isScanning && (
            <div className="text-center space-y-4 p-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setIsScanning(true)}
              >
                Start Camera Scan
              </Button>
            </div>
          )}

          {isScanning && (
            <>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center border-[40px] border-black/40">
                <div className="w-full h-full border-2 border-primary/50 relative">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary shadow-[0_0_10px_hsl(var(--primary))] animate-pulse"></div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-4 right-4 z-10"
                onClick={() => setIsScanning(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-medium text-xs bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm z-10 whitespace-nowrap">
                Align QR code within frame
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
                Please allow camera access in your browser to use the scanner.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">OR MANUAL ENTRY</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Enter QR ID (e.g. VOL-1001)" 
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <Button 
                className="bg-primary" 
                onClick={() => handleScan(manualCode)}
                disabled={!manualCode}
              >
                Verify
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {lastScan && (
        <Alert className="bg-red-50 border-red-200">
          <CheckCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Scan Recorded</AlertTitle>
          <AlertDescription className="text-red-700">
            <strong>{lastScan.name}</strong> checked <strong>{lastScan.type}</strong> at {lastScan.time}
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 font-headline">
            <History className="h-5 w-5 text-primary" />
            Recent Scans
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-1">
             {[
               { name: "Andres Bonifacio", type: "In", time: "10:45 AM" },
               { name: "Jose Rizal", type: "Out", time: "10:30 AM" },
               { name: "Maria Clara", type: "In", time: "09:15 AM" }
             ].map((scan, i) => (
               <div key={i} className="flex items-center justify-between px-6 py-3 border-b last:border-0 hover:bg-muted/50 transition">
                 <div>
                   <p className="font-medium text-sm">{scan.name}</p>
                   <p className="text-xs text-muted-foreground">{scan.time}</p>
                 </div>
                 <Badge variant={scan.type === 'In' ? 'default' : 'secondary'} className={scan.type === 'In' ? 'bg-primary hover:bg-primary/90' : ''}>
                   {scan.type === 'In' ? <CheckCircle className="w-3 h-3 mr-1" /> : <LogOut className="w-3 h-3 mr-1" />}
                   Check {scan.type}
                 </Badge>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
