import { initTRPC } from "@trpc/server";

import superjson from "superjson";

import { ZodError } from "zod";

import type Context from "./types/context";

import isValidCountryCode from "./utils/countryCode";
import isValidPublicIP from "./utils/ip";

export const createTRPCContext = async ({
  headers,
  resHeaders,
}: {
  headers: Headers;
  resHeaders: Headers;
}): Promise<Context> => {
  const payNowStorefrontHeaders: Record<string, string> = {};

  // IP Address & Country Code Forwarding

  const realIpAddress =
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  const realCountryCode = headers.get("cf-ipcountry");

  if (realIpAddress && isValidPublicIP(realIpAddress)) {
    payNowStorefrontHeaders["x-paynow-customer-ip"] = realIpAddress;
  }

  if (realCountryCode && isValidCountryCode(realCountryCode)) {
    payNowStorefrontHeaders["x-paynow-customer-countrycode"] = realCountryCode;
  }

  const pnToken = headers
    .get("cookie")
    ?.split(";")
    ?.find((cookie) => cookie.trim().startsWith("pn_token="))
    ?.split("=")[1];

  if (pnToken) {
    payNowStorefrontHeaders.Authorization = `Customer ${pnToken}`;
  }

  return {
    headers,
    resHeaders,
    payNowStorefrontHeaders,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
