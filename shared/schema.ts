import { pgTable, text, serial, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll use this table to simulate the "Demo Utility" state (e.g. badges unlocked)
// in case the on-chain interaction is simulated or purely frontend-based for the demo.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  hasDemoBadge: boolean("has_demo_badge").default(false),
  // Store simulation data if needed
  demoBalance: text("demo_balance").default("0"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Request types
export type ClaimBadgeRequest = {
  walletAddress: string;
};

export type UpdateBalanceRequest = {
  walletAddress: string;
  balance: string;
};
