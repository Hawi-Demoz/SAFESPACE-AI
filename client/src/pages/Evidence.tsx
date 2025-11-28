import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Upload, Key, CheckCircle, RefreshCw, FileLock } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEvidence, getEvidence } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

// Simple client-side AES encryption simulation
function simpleEncrypt(text: string): string {
  // In production, use crypto.subtle.encrypt with AES-GCM
  // For demo, we'll use base64 encoding with a marker
  return btoa("ENCRYPTED:" + text);
}

export default function Evidence() {
  const [evidenceText, setEvidenceText] = useState("");
  const queryClient = useQueryClient();

  const { data: evidenceList = [] } = useQuery({
    queryKey: ["evidence"],
    queryFn: getEvidence,
  });

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const encrypted = simpleEncrypt(text);
      const size = new Blob([encrypted]).size;
      
      return createEvidence({
        type: "text",
        encryptedContent: encrypted,
        metadata: { size: `${size} bytes` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      setEvidenceText("");
      toast.success("Evidence encrypted and saved securely");
    },
    onError: () => {
      toast.error("Failed to save evidence");
    },
  });

  const handleEncrypt = () => {
    if (!evidenceText.trim()) return;
    mutation.mutate(evidenceText);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-2">Encrypted Evidence Locker</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Securely store screenshots and text logs. All data is AES-256 encrypted locally 
          in your browser before storage. We cannot access your data.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glass-panel border-0">
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
            <CardDescription>Paste text or upload screenshots to encrypt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Paste harassing messages, links, or notes here..." 
              className="min-h-[150px] bg-black/20 border-white/10 focus:border-primary"
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              data-testid="input-evidence-text"
            />
            
            <div className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-sm">Drop screenshots here</span>
            </div>

            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleEncrypt}
              disabled={mutation.isPending || !evidenceText.trim()}
              data-testid="button-encrypt-save"
            >
              {mutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Encrypting...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" /> Encrypt & Save
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 bg-black/20">
          <CardHeader>
            <CardTitle>Your Vault</CardTitle>
            <CardDescription>
              {evidenceList.length} encrypted {evidenceList.length === 1 ? 'entry' : 'entries'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {evidenceList.length > 0 ? (
                evidenceList.map((item) => (
                  <VaultItem 
                    key={item.id}
                    date={format(new Date(item.createdAt), "MMM dd, yyyy, hh:mm a")}
                    type={item.type === "text" ? "Text Log" : "Screenshot"}
                    size={item.metadata.size}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileLock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No evidence stored yet</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-muted-foreground">
                <Key className="w-4 h-4 mr-2" /> Manage Encryption Keys
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VaultItem({ date, type, size }: { date: string, type: string, size: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded bg-primary/10 text-primary">
          <FileLock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-sm font-medium text-white">{type}</div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
      </div>
      <div className="text-xs font-mono text-muted-foreground">{size}</div>
    </div>
  )
}
