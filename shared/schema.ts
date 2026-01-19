import { pgTable, text, serial, integer, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").default("All-rounder"),
  imageUrl: text("image_url"),
});

export const matchStats = pgTable("match_stats", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  date: date("date").notNull(),
  runs: integer("runs").notNull().default(0),
  ballsFaced: integer("balls_faced").notNull().default(0),
  fours: integer("fours").notNull().default(0),
  sixes: integer("sixes").notNull().default(0),
  wickets: integer("wickets").notNull().default(0),
  oversBowled: numeric("overs_bowled").notNull().default("0"),
  runsConceded: integer("runs_conceded").notNull().default(0),
  wicketTakenBy: integer("wicket_taken_by"), // New field: player ID who took the wicket
});

export const playersRelations = relations(players, ({ many }) => ({
  stats: many(matchStats),
}));

export const matchStatsRelations = relations(matchStats, ({ one }) => ({
  player: one(players, {
    fields: [matchStats.playerId],
    references: [players.id],
  }),
}));

export const insertPlayerSchema = createInsertSchema(players).omit({ id: true });
export const insertMatchStatsSchema = createInsertSchema(matchStats).omit({ id: true });

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type MatchStats = typeof matchStats.$inferSelect;
export type InsertMatchStats = z.infer<typeof insertMatchStatsSchema>;

// Calculated stats interface (not in DB)
export interface PlayerStats extends Player {
  matches: number;
  totalRuns: number;
  totalBalls: number;
  totalWickets: number;
  battingAverage: number;
  strikeRate: number;
  bowlingAverage: number;
  economyRate: number;
  fifties: number;
  hundreds: number;
  bestBatting: number;
  bestBowling: string; // "3/15" format
}
