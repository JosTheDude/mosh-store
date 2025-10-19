import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (provider !== "steam") {
    return;
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.toString();

  const result = await api.paynow.steamLogin({
    query,
  });

  const cookiesData = await cookies();

  cookiesData.set("pn_token", result, {
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  const returnUrl =
    cookiesData.get("return_url")?.value ?? env.NEXT_PUBLIC_WEBSITE_URL;

  return NextResponse.redirect(returnUrl);
}

export const runtime = 'edge';
