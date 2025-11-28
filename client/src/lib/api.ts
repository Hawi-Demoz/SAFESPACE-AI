// API client utilities

export interface ToxicityResult {
  isToxic: boolean;
  confidence: number;
  categories: Record<string, number>;
  flaggedPatterns: string[];
}

export interface Evidence {
  id: number;
  type: string;
  encryptedContent: string;
  metadata: { size: string; originalName?: string };
  createdAt: string;
}

export interface WeeklyData {
  day: string;
  toxic: number;
  safe: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

// Analyze text for toxicity
export async function analyzeText(text: string): Promise<ToxicityResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  
  if (!response.ok) {
    throw new Error("Analysis failed");
  }
  
  return response.json();
}

// Evidence API
export async function createEvidence(data: {
  type: string;
  encryptedContent: string;
  metadata: { size: string; originalName?: string };
}): Promise<Evidence> {
  const response = await fetch("/api/evidence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to save evidence");
  }
  
  return response.json();
}

export async function getEvidence(): Promise<Evidence[]> {
  const response = await fetch("/api/evidence");
  
  if (!response.ok) {
    throw new Error("Failed to fetch evidence");
  }
  
  return response.json();
}

// Analytics API
export async function getWeeklyAnalytics(): Promise<{
  weeklyData: WeeklyData[];
  categoryData: CategoryData[];
}> {
  const response = await fetch("/api/analytics/weekly");
  
  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }
  
  return response.json();
}
