import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import SteamService from "../services/steam";
import PayNowService from "./../services/paynow";

export const paynowRouter = createTRPCRouter({
  getStore: publicProcedure.query(({ ctx }) => PayNowService.getStore(ctx)),

  getProducts: publicProcedure.query(({ ctx }) =>
    PayNowService.getProducts(ctx),
  ),

  getNavlinks: publicProcedure.query(({ ctx }) =>
    PayNowService.getNavlinks(ctx),
  ),

  getModules: publicProcedure.query(({ ctx }) => PayNowService.getModules(ctx)),

  getAuth: publicProcedure.query(({ ctx }) => PayNowService.getAuth(ctx)),

  getCart: publicProcedure.query(({ ctx }) => PayNowService.getCart(ctx)),

  updateCartItem: publicProcedure
    .input(
      z.object({
        product_id: z.string(),
        quantity: z.number(),
        gameserver_id: z.string().optional().nullable(),
        increment: z.boolean().default(true),
      }),
    )
    .mutation(({ ctx, input }) => PayNowService.updateCartItem(ctx, input)),

  checkout: publicProcedure
    .input(
      z.object({
        subscription: z.boolean(),
        lines: z
          .object({
            product_id: z.string(),
            quantity: z.number(),
            gift_to: z
              .object({
                platform: z.string(),
                id: z.string(),
              })
              .optional()
              .nullable(),
            gift_to_customer_id: z.string().optional().nullable(),
            selected_gameserver_id: z.string().optional().nullable(),
          })
          .array(),
      }),
    )
    .mutation(({ ctx, input }) => PayNowService.checkout(ctx, input)),

  minecraftLogin: publicProcedure
    .input(
      z.object({
        username: z.string().trim().max(64),
        platform: z.enum(["bedrock", "java"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const customerId = await PayNowService.findOrCreateMinecraftCustomer(
        input.username,
        input.platform,
      );

      const token = await PayNowService.generateAuthToken(customerId);

      PayNowService.setAuthCookie(ctx, token);
    }),

  steamLogin: publicProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { query } = input;

      const steamId = await SteamService.resolveSteamIdFromOpenIdQS(query);

      const customerId = await PayNowService.findOrCreateSteamCustomer(steamId);

      const token = await PayNowService.generateAuthToken(customerId);

      return token;
    }),

  getSteamLoginUrl: publicProcedure.query(async ({ ctx }) =>
    SteamService.getLoginUrl(),
  ),

  logout: publicProcedure.mutation(({ ctx }) => PayNowService.logout(ctx)),

  getGiftcardBalanceByCode: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).trim(),
      }),
    )
    .mutation(({ input }) =>
      PayNowService.getGiftcardBalanceByCode(input.code),
    ),
});
