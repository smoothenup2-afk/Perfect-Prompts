import { z } from "zod";
import { insertMatchStatsSchema, insertPlayerSchema, players, matchStats } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  players: {
    list: {
      method: 'GET' as const,
      path: '/api/players',
      responses: {
        200: z.array(z.custom<any>()), // Returns PlayerStats[]
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/players/:id',
      responses: {
        200: z.custom<any>(), // Returns PlayerStats
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/players/:id',
      input: insertPlayerSchema.partial(),
      responses: {
        200: z.custom<typeof players.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  stats: {
    create: {
      method: 'POST' as const,
      path: '/api/stats',
      input: insertMatchStatsSchema,
      responses: {
        201: z.custom<typeof matchStats.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.array(z.custom<typeof matchStats.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
