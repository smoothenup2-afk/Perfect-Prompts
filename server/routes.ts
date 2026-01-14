import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.players.list.path, async (req, res) => {
    const players = await storage.getPlayers();
    res.json(players);
  });

  app.get(api.players.get.path, async (req, res) => {
    const player = await storage.getPlayer(Number(req.params.id));
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  });

  app.patch(api.players.update.path, async (req, res) => {
    try {
      const input = api.players.update.input.parse(req.body);
      const player = await storage.updatePlayer(Number(req.params.id), input);
      res.json(player);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.stats.create.path, async (req, res) => {
    try {
      const input = api.stats.create.input.parse(req.body);
      const stats = await storage.addMatchStats(input);
      res.status(201).json(stats);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.stats.list.path, async (req, res) => {
    const stats = await storage.getMatchStats();
    res.json(stats);
  });

  // Seed data if empty
  const players = await storage.getPlayers();
  if (players.length === 0) {
    const names = ["Himanshu", "Kuldeep", "Monti", "Ronaldo", "Jitu", "Dilip"];
    for (const name of names) {
      await storage.createPlayer({ name, role: "All-rounder" });
    }
    console.log("Seeded initial players");
  }

  return httpServer;
}
