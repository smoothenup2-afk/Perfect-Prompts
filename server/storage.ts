import { db } from "./db";
import {
  players,
  matchStats,
  type InsertPlayer,
  type InsertMatchStats,
  type Player,
  type MatchStats,
  type PlayerStats
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getPlayers(): Promise<PlayerStats[]>;
  getPlayer(id: number): Promise<PlayerStats | undefined>;
  updatePlayer(id: number, updates: Partial<InsertPlayer>): Promise<Player>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  addMatchStats(stats: InsertMatchStats): Promise<MatchStats>;
  getMatchStats(): Promise<MatchStats[]>;
}

export class DatabaseStorage implements IStorage {
  private calculatePlayerStats(player: Player, stats: MatchStats[]): PlayerStats {
    const totalRuns = stats.reduce((sum, s) => sum + s.runs, 0);
    const totalBalls = stats.reduce((sum, s) => sum + s.ballsFaced, 0);
    const totalWickets = stats.reduce((sum, s) => sum + s.wickets, 0);
    const totalRunsConceded = stats.reduce((sum, s) => sum + s.runsConceded, 0);
    const totalOvers = stats.reduce((sum, s) => sum + Number(s.oversBowled), 0);
    const matches = stats.length;

    // Batting Stats
    const battingAverage = matches > 0 ? totalRuns / matches : 0; // Simplified: usually calculated as Runs / (Innings - Not Outs). Assuming 0 not outs for simplicity unless we add that field.
    const strikeRate = totalBalls > 0 ? (totalRuns / totalBalls) * 100 : 0;
    const fifties = stats.filter(s => s.runs >= 50 && s.runs < 100).length;
    const hundreds = stats.filter(s => s.runs >= 100).length;
    const bestBatting = stats.reduce((max, s) => Math.max(max, s.runs), 0);

    // Bowling Stats
    const bowlingAverage = totalWickets > 0 ? totalRunsConceded / totalWickets : 0;
    const economyRate = totalOvers > 0 ? totalRunsConceded / totalOvers : 0;
    
    // Best Bowling: Most wickets, then least runs
    const bestBowlingStat = stats.reduce((best, s) => {
      if (s.wickets > best.wickets) return s;
      if (s.wickets === best.wickets && s.runsConceded < best.runsConceded) return s;
      return best;
    }, { wickets: 0, runsConceded: 0 } as MatchStats);
    
    const bestBowling = bestBowlingStat.wickets > 0 
      ? `${bestBowlingStat.wickets}/${bestBowlingStat.runsConceded}`
      : "N/A";

    return {
      ...player,
      matches,
      totalRuns,
      totalBalls,
      totalWickets,
      battingAverage: Number(battingAverage.toFixed(2)),
      strikeRate: Number(strikeRate.toFixed(2)),
      bowlingAverage: Number(bowlingAverage.toFixed(2)),
      economyRate: Number(economyRate.toFixed(2)),
      fifties,
      hundreds,
      bestBatting,
      bestBowling
    };
  }

  async getPlayers(): Promise<PlayerStats[]> {
    const allPlayers = await db.select().from(players);
    const allStats = await db.select().from(matchStats);

    return allPlayers.map(player => {
      const pStats = allStats.filter(s => s.playerId === player.id);
      return this.calculatePlayerStats(player, pStats);
    });
  }

  async getPlayer(id: number): Promise<PlayerStats | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    if (!player) return undefined;

    const stats = await db.select().from(matchStats).where(eq(matchStats.playerId, id));
    return this.calculatePlayerStats(player, stats);
  }

  async updatePlayer(id: number, updates: Partial<InsertPlayer>): Promise<Player> {
    const [updated] = await db.update(players)
      .set(updates)
      .where(eq(players.id, id))
      .returning();
    return updated;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [newPlayer] = await db.insert(players).values(player).returning();
    return newPlayer;
  }

  async addMatchStats(stats: InsertMatchStats): Promise<MatchStats> {
    const [newStats] = await db.insert(matchStats).values(stats).returning();
    return newStats;
  }

  async getMatchStats(): Promise<MatchStats[]> {
    return await db.select().from(matchStats).orderBy(desc(matchStats.date));
  }
}

export const storage = new DatabaseStorage();
