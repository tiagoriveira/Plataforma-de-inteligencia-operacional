import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Assets router
  assets: router({
    list: publicProcedure.query(async () => {
      return await db.getAllAssets();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getAssetById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["MÁQUINA", "VEÍCULO", "FERRAMENTA", "OUTRO"]),
        location: z.string(),
        status: z.enum(["OPERACIONAL", "MANUTENÇÃO", "CRÍTICO", "INATIVO"]).optional(),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
        year: z.number().optional(),
        warranty: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createAsset({
          ...input,
          createdBy: ctx.user.id,
        });
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(["OPERACIONAL", "MANUTENÇÃO", "CRÍTICO", "INATIVO"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateAssetStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // Events router
  events: router({
    list: publicProcedure.query(async () => {
      return await db.getAllEvents();
    }),
    
    getByAssetId: publicProcedure
      .input(z.object({ assetId: z.string() }))
      .query(async ({ input }) => {
        return await db.getEventsByAssetId(input.assetId);
      }),
    
    create: publicProcedure
      .input(z.object({
        assetId: z.string(),
        type: z.enum(["CHECKIN", "CHECKOUT", "INSPECTION", "ISSUE", "IMPROVEMENT", "MAINTENANCE"]),
        operator: z.string(),
        observation: z.string().optional(),
        photoUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createEvent({
          ...input,
          userId: ctx.user?.id,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
