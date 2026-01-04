import { z } from 'zod';
import { insertUserSchema, users } from './schema';

export const api = {
  users: {
    get: {
      method: 'GET' as const,
      path: '/api/users/:walletAddress',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    claimBadge: {
      method: 'POST' as const,
      path: '/api/users/:walletAddress/badge',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    updateBalance: {
      method: 'PATCH' as const,
      path: '/api/users/:walletAddress/balance',
      input: z.object({ demoBalance: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    }
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
