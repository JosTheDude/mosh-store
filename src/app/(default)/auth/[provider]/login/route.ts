import { cookies, headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (provider !== "steam") {
    return;
  }

  const headersList = await headers();
  const referer = headersList.get("referer");

  if (referer) {
    const cookiesData = await cookies();

    cookiesData.set("return_url", referer, {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });
  }

  const result = await api.paynow.getSteamLoginUrl();

  return NextResponse.redirect(result);
}

export const runtime = "edge";
