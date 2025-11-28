import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { analyzeText } from "@/lib/api";

export function ToxicityTester() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: analyzeText,
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setResult(null);
    mutation.mutate(text);
  };

  const testExamples = [
    "You're so stupid, nobody likes you",
    "Hey, how was your day? Hope you're doing well!",
    "I'm going to hurt you if you don't do what I say",
    "Send me pics or I'll tell everyone your secrets",
  ];

  return (
    <Card className="glass-panel border-0 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Test the AI Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type or paste a message to test the toxicity detection..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px] bg-black/20 border-white/10"
          data-testid="input-test-text"
        />

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Quick tests:</span>
          {testExamples.map((example, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => setText(example)}
              className="text-xs border-white/10"
            >
              Example {i + 1}
            </Button>
          ))}
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={!text.trim() || mutation.isPending}
          className="w-full bg-primary text-primary-foreground"
          data-testid="button-analyze"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 mr-2" /> Analyze Text
            </>
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.isToxic 
              ? 'bg-red-500/10 border-red-500/20' 
              : 'bg-green-500/10 border-green-500/20'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-lg">
                {result.isToxic ? '⚠️ Harmful Content Detected' : '✅ Content is Safe'}
              </span>
              <span className="text-sm font-mono">
                {Math.round(result.confidence * 100)}% confidence
              </span>
            </div>

            {result.isToxic && Object.keys(result.categories).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Detected categories:</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(result.categories).map(([cat, score]: [string, any]) => (
                    <span
                      key={cat}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20"
                    >
                      {cat}: {Math.round(score * 100)}%
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
