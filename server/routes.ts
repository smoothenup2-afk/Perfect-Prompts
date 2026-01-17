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

  app.patch(api.stats.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.stats.update.input.parse(req.body);
      const stats = await storage.updateMatchStats(id, input);
      res.json(stats);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.stats.delete.path, async (req, res) => {
    await storage.deleteMatchStats(Number(req.params.id));
    res.status(204).end();
  });

  // Seed data if empty
  const playersData = await storage.getPlayers();
  if (playersData.length === 0) {
    const names = ["Himanshu", "Kuldeep", "Monti", "Ronaldo", "Jitu", "Dilip", "Prakash"];
    for (const name of names) {
      await storage.createPlayer({ name, role: "All-rounder" });
    }
    console.log("Seeded initial players including Prakash");
  } else {
    // Check if Prakash exists, if not add him
    const prakash = playersData.find(p => p.name === "Prakash");
    if (!prakash) {
      await storage.createPlayer({ name: "Prakash", role: "All-rounder" });
      console.log("Added missing player: Prakash");
    }
  }

  return httpServer;
}
