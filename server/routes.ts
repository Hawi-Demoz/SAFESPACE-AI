import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { analyzeToxicity } from "./ml/toxicity-detector";
import { insertEvidenceSchema, insertAnalyticsSchema, insertResourceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ML Analysis Endpoint - Core feature
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: "Text is required" });
      }

      const result = analyzeToxicity(text);
      
      // Track analytics if toxic content detected
      if (result.isToxic) {
        const today = new Date().toISOString().split('T')[0];
        const primaryCategory = Object.keys(result.categories)[0] || 'other';
        await storage.incrementToxicCount(today, primaryCategory);
      }

      return res.json(result);
    } catch (error) {
      console.error("Analysis error:", error);
      return res.status(500).json({ error: "Analysis failed" });
    }
  });

  // Evidence Endpoints
  app.post("/api/evidence", async (req, res) => {
    try {
      const validatedData = insertEvidenceSchema.parse(req.body);
      const evidence = await storage.createEvidence(validatedData);
      return res.status(201).json(evidence);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Evidence creation error:", error);
      return res.status(500).json({ error: "Failed to save evidence" });
    }
  });

  app.get("/api/evidence", async (req, res) => {
    try {
      const evidence = await storage.getEvidence();
      return res.json(evidence);
    } catch (error) {
      console.error("Evidence retrieval error:", error);
      return res.status(500).json({ error: "Failed to retrieve evidence" });
    }
  });

  // Analytics Endpoints
  app.get("/api/analytics/weekly", async (req, res) => {
    try {
      // Get last 7 days
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      // Fetch analytics for each date
      const analyticsData = await Promise.all(
        dates.map(async (date) => {
          const data = await storage.getAnalyticsByDateRange(date, date);
          return data[0] || { date, toxicCount: 0, safeCount: 0, categories: {} };
        })
      );

      // Transform to frontend format
      const weeklyData = analyticsData.map((d, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
        toxic: d.toxicCount,
        safe: d.safeCount,
      }));

      // Aggregate categories
      const categoryTotals: Record<string, number> = {};
      analyticsData.forEach(d => {
        Object.entries(d.categories || {}).forEach(([cat, count]) => {
          categoryTotals[cat] = (categoryTotals[cat] || 0) + (count as number);
        });
      });

      const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));

      return res.json({ weeklyData, categoryData });
    } catch (error) {
      console.error("Analytics error:", error);
      return res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Resources Endpoints
  app.get("/api/resources", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const resources = category 
        ? await storage.getResourcesByCategory(category)
        : await storage.getAllResources();
      return res.json(resources);
    } catch (error) {
      console.error("Resources error:", error);
      return res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      return res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Resource creation error:", error);
      return res.status(500).json({ error: "Failed to create resource" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
