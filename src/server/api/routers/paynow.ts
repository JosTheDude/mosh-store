import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import axios from "axios";
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

      const params = new URLSearchParams(query);

      if (params.get("openid.mode") !== "id_res") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invaild OpenID Mode",
        });
      }

      const requiredFields = [
        "openid.op_endpoint",
        "openid.claimed_id",
        "openid.identity",
        "openid.response_nonce",
        "openid.assoc_handle",
        "openid.signed",
        "openid.sig",
      ];

      for (const field of requiredFields) {
        if (!params.get(field)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Some required Open ID Fields are missing",
          });
        }
      }

      if (
        params.get("openid.op_endpoint") !==
        "https://steamcommunity.com/openid/login"
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invaild OP Endpoint",
        });
      }

      const claimedId = params.get("openid.claimed_id");

      if (!claimedId?.startsWith("https://steamcommunity.com/openid/id/")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invaild OpenID Claimed ID",
        });
      }

      const verifyParams = new URLSearchParams(params);

      verifyParams.set("openid.mode", "check_authentication");

      const response = await axios.get(
        "https://steamcommunity.com/openid/login",
        { params: verifyParams },
      );

      if (!response.data.includes("is_valid:true")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not validate Steam login",
        });
      }

      const steamId = params.get("openid.claimed_id")?.split("/").pop();

      if (!steamId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not confirm SteamID64",
        });
      }

      const customerId = await PayNowService.findOrCreateSteamCustomer(steamId);
      const token = await PayNowService.generateAuthToken(customerId);

      console.log(token);

      return token;
    }),

  getSteamLoginUrl: publicProcedure.query(async ({ ctx }) =>
    PayNowService.getSteamLoginUrl(),
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
