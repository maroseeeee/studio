
"use client";

import { useState } from "react";
import { generateVolunteerThankYouMessage } from "@/ai/flows/generate-volunteer-thank-you-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Loader2, 
  MessageSquare,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CommunicationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{message: string, suggestedSubject: string} | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await generateVolunteerThankYouMessage({
        volunteerName: formData.get("name") as string,
        volunteerEmail: formData.get("email") as string,
        participationDetails: formData.get("details") as string,
      });
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(`Subject: ${result.suggestedSubject}\n\n${result.message}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary font-headline">AI Communication Tool</h2>
        <p className="text-muted-foreground">Draft personalized appreciation messages for your volunteers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Volunteer Info</CardTitle>
            <CardDescription>Provide details for the AI to personalize the message</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Volunteer Name</Label>
                <Input id="name" name="name" placeholder="e.g. Maria Clara" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" name="email" type="email" placeholder="maria@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Contributions/Notes</Label>
                <Textarea 
                  id="details" 
                  name="details" 
                  placeholder="e.g. Helped at the medical station for 8 hours, showed great empathy to devotees."
                  className="min-h-[120px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="bg-muted/50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" />
                Draft Output
              </CardTitle>
              {result && (
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {!result ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
                <p>Fill out the form and click generate to see the AI magic.</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Suggested Subject</p>
                  <p className="font-semibold text-primary">{result.suggestedSubject}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Message Body</p>
                  <div className="bg-muted/30 p-4 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap">
                    {result.message}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Text
                  </Button>
                  <Button className="flex-1 bg-accent hover:bg-accent/90">
                    <Send className="mr-2 h-4 w-4" /> Send Email
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
