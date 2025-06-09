"use client";

import {
  CopyIcon,
  DiscordLogoIcon,
  PlayIcon,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import AuthCard from "~/components/auth/auth-card";
import AuthDialog from "~/components/auth/auth-dialog";
import CartSheet from "~/components/cart/cart-sheet";
import PendingCartHandler from "~/components/cart/pending-cart-handler";
import Footer from "~/components/footer/footer";
import Header from "~/components/header/header";
import GiftcardBalanceCard from "~/components/modules/giftcard-balance-card";
import PaymentGoalCard from "~/components/modules/payment-goal-card";
import RecentPaymentsCard from "~/components/modules/recent-payments-card";
import NavlinkCard from "~/components/navlink/navlink-card";
import { env } from "~/env";
import type Module from "~/server/api/types/paynow/module";
import { api } from "~/trpc/react";

export default function DefaultLayout({
  children,
}: { children: React.ReactNode }) {
  const { data: store } = api.paynow.getStore.useQuery();
  const { data: modules } = api.paynow.getModules.useQuery();
  const { data: playerCount } = api.gsa.getPlayerCount.useQuery();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        env.NEXT_PUBLIC_GAMESERVER_CONNECTION_MESSAGE,
      );

      toast("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!store) {
    return null;
  }

  const giftcardBalanceModule = modules?.find(
    (x) => x.id === "giftcard_balance",
  );
  const paymentGoalModule = modules?.find((x) => x.id === "payment_goal");
  const recentPaymentsModule = modules?.find((x) => x.id === "recent_payments");

  return (
    <>
      <>
        <PendingCartHandler />
        <CartSheet />
        <AuthDialog />
      </>

      <Header />

      <section>
        <div className="mx-auto md:max-w-7xl">
          <div className="grid grid-cols-3 items-center py-6 md:py-12">
            <button
              type="button"
              className="group hidden cursor-pointer items-center gap-6 lg:flex"
              onClick={handleCopy}
            >
              <div className="flex w-full flex-col items-end text-right">
                <span className="block font-bold text-2xl">Play Now</span>

                <div className="flex items-center gap-1">
                  <CopyIcon
                    size={16}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />

                  <span>{env.NEXT_PUBLIC_GAMESERVER_CONNECTION_MESSAGE}</span>
                </div>
              </div>

              <div className="relative w-min rounded-full bg-accent p-3">
                <div
                  className={twMerge(
                    "-top-3 -right-3 absolute rounded-4xl bg-destructive px-2 transition-opacity duration-300",
                    (playerCount ?? 0) > 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  <p className="font-semibold">{playerCount}</p>
                </div>

                <PlayIcon weight="fill" height={36} width={36} />
              </div>
            </button>

            <div className="col-span-3 lg:col-span-1">
              <div className="mx-auto flex size-52 items-center justify-center overflow-hidden">
                <img
                  alt={store.name}
                  src={
                    store.logo_square_url ?? "https://i.imgur.com/hKskz67.png"
                  }
                  className="h-full w-full animate-smooth-bob object-cover"
                />
              </div>
            </div>

            <a
              href={env.NEXT_PUBLIC_DISCORD_INVITE_URL}
              target="_blank"
              rel="noreferrer"
            >
              <div className="hidden items-center gap-6 lg:flex">
                <div className="relative w-min rounded-full bg-accent p-3">
                  <DiscordLogoIcon weight="fill" height={36} width={36} />
                </div>

                <div>
                  <h3 className="font-bold text-2xl">Discord</h3>
                  <p>{env.NEXT_PUBLIC_DISCORD_INVITE_URL}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <main>
        <div className="mx-auto md:max-w-7xl">
          <div className="grid-cols-3 gap-6 space-y-6 p-4 md:grid xl:p-0">
            <div className="col-span-1 space-y-6">
              <AuthCard />

              <NavlinkCard />

              {giftcardBalanceModule && (
                <GiftcardBalanceCard
                  module={giftcardBalanceModule as Module<"giftcard_balance">}
                />
              )}

              {paymentGoalModule && (
                <PaymentGoalCard
                  module={paymentGoalModule as Module<"payment_goal">}
                />
              )}

              {recentPaymentsModule && (
                <RecentPaymentsCard
                  module={recentPaymentsModule as Module<"recent_payments">}
                />
              )}
            </div>

            <div className="col-span-2">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
