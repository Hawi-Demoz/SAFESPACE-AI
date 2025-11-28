import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Evidence Table - Stores encrypted evidence entries
export const evidence = pgTable("evidence", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "text" or "screenshot"
  encryptedContent: text("encrypted_content").notNull(),
  metadata: jsonb("metadata").$type<{ size: string, originalName?: string }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEvidenceSchema = createInsertSchema(evidence).omit({ id: true, createdAt: true });
export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type Evidence = typeof evidence.$inferSelect;

// Analytics Table - Tracks user's daily exposure metrics
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD format
  toxicCount: integer("toxic_count").notNull().default(0),
  safeCount: integer("safe_count").notNull().default(0),
  categories: jsonb("categories").$type<Record<string, number>>().default({}),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

// Resources Table - Support resources and guides
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "emergency", "education", "support"
  actionText: text("action_text").notNull(),
  icon: text("icon").notNull(),
  link: text("link"),
});

export const insertResourceSchema = createInsertSchema(resources).omit({ id: true });
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
