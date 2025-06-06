import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { gsaRouter } from "./routers/gsa";
import { paynowRouter } from "./routers/paynow";

export const appRouter = createTRPCRouter({
  paynow: paynowRouter,
  gsa: gsaRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
