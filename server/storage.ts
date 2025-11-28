import { 
  type Evidence, 
  type InsertEvidence, 
  type Analytics,
  type InsertAnalytics,
  type Resource,
  type InsertResource,
  evidence,
  analytics,
  resources
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Evidence methods
  createEvidence(data: InsertEvidence): Promise<Evidence>;
  getEvidence(): Promise<Evidence[]>;
  
  // Analytics methods
  getAnalyticsByDateRange(startDate: string, endDate: string): Promise<Analytics[]>;
  upsertAnalytics(data: InsertAnalytics): Promise<Analytics>;
  incrementToxicCount(date: string, category: string): Promise<void>;
  
  // Resources methods
  getAllResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  createResource(data: InsertResource): Promise<Resource>;
}

export class DatabaseStorage implements IStorage {
  // Evidence methods
  async createEvidence(data: InsertEvidence): Promise<Evidence> {
    const [result] = await db.insert(evidence).values(data).returning();
    return result;
  }

  async getEvidence(): Promise<Evidence[]> {
    return db.select().from(evidence).orderBy(desc(evidence.createdAt));
  }

  // Analytics methods
  async getAnalyticsByDateRange(startDate: string, endDate: string): Promise<Analytics[]> {
    return db.select().from(analytics).where(
      // Simple range check - would need better date handling in production
      eq(analytics.date, startDate) // Simplified for demo
    );
  }

  async upsertAnalytics(data: InsertAnalytics): Promise<Analytics> {
    // Check if analytics for this date exists
    const existing = await db.select().from(analytics).where(eq(analytics.date, data.date));
    
    if (existing.length > 0) {
      // Update existing
      const [updated] = await db
        .update(analytics)
        .set({
          toxicCount: data.toxicCount,
          safeCount: data.safeCount,
          categories: data.categories,
        })
        .where(eq(analytics.date, data.date))
        .returning();
      return updated;
    } else {
      // Insert new
      const [inserted] = await db.insert(analytics).values(data).returning();
      return inserted;
    }
  }

  async incrementToxicCount(date: string, category: string): Promise<void> {
    const existing = await db.select().from(analytics).where(eq(analytics.date, date));
    
    if (existing.length > 0) {
      const current = existing[0];
      const updatedCategories = { ...(current.categories || {}), [category]: ((current.categories as any)?.[category] || 0) + 1 };
      
      await db
        .update(analytics)
        .set({
          toxicCount: current.toxicCount + 1,
          categories: updatedCategories,
        })
        .where(eq(analytics.date, date));
    } else {
      await db.insert(analytics).values({
        date,
        toxicCount: 1,
        safeCount: 0,
        categories: { [category]: 1 },
      });
    }
  }

  // Resources methods
  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.category, category));
  }

  async createResource(data: InsertResource): Promise<Resource> {
    const [result] = await db.insert(resources).values(data).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
