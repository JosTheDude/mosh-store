import "~/styles/globals.css";

import { Montserrat } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import Snowflake from "~/components/snowflake";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient, api } from "~/trpc/server";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export async function generateMetadata() {
  const store = await api.paynow.getStore();

  return {
    title: `Store | + ${store.name}`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await Promise.all([
    api.paynow.getStore.prefetch(),

    api.paynow.getAuth.prefetch(),
    api.paynow.getCart.prefetch(),

    api.paynow.getTags.prefetch(),
    api.paynow.getNavlinks.prefetch(),
    api.paynow.getProducts.prefetch(),
    api.paynow.getModules.prefetch(),
  ]);

  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body className="min-h-screen">
        <NextTopLoader color="var(--primary)" />

        <Snowflake />

        <Toaster position="top-center" />

        <TRPCReactProvider>
          <HydrateClient>{children}</HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
