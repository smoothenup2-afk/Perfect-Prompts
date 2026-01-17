import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertMatchStats, type InsertPlayer, type PlayerStats } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// ============================================
// Players Hooks
// ============================================

export function usePlayers() {
  return useQuery({
    queryKey: [api.players.list.path],
    queryFn: async () => {
      const res = await fetch(api.players.list.path);
      if (!res.ok) throw new Error("Failed to fetch players");
      return api.players.list.responses[200].parse(await res.json());
    },
  });
}

export function usePlayer(id: number) {
  return useQuery({
    queryKey: [api.players.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.players.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch player stats");
      return api.players.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useUpdatePlayer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertPlayer>) => {
      const url = buildUrl(api.players.update.path, { id });
      const res = await fetch(url, {
        method: api.players.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update player");
      return api.players.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.players.list.path] });
      toast({ title: "Success", description: "Player updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useMatchStats() {
  return useQuery({
    queryKey: [api.stats.list.path],
    queryFn: async () => {
      const res = await fetch(api.stats.list.path);
      if (!res.ok) throw new Error("Failed to fetch match stats");
      return api.stats.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateStats() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertMatchStats>) => {
      const url = buildUrl(api.stats.update.path, { id });
      const res = await fetch(url, {
        method: api.stats.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update stats");
      return api.stats.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.players.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.list.path] });
      toast({ title: "Success", description: "Stats updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteStats() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.stats.delete.path, { id });
      const res = await fetch(url, { method: api.stats.delete.method });
      if (!res.ok) throw new Error("Failed to delete stats");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.players.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.list.path] });
      toast({ title: "Success", description: "Stats deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

// ============================================
// Stats Hooks
// ============================================

export function useAddStats() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertMatchStats) => {
      const res = await fetch(api.stats.create.path, {
        method: api.stats.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to add stats");
      }
      return api.stats.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.players.list.path] });
      toast({ title: "Stats Added", description: "Match data has been recorded." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
