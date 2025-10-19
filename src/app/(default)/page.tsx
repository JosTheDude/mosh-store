"use client";

import NavlinkCards from "~/components/navlink/navlink-cards";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="inline-block font-extrabold text-3xl">
            Official Mosh Store
          </CardTitle>

          <CardDescription className="hidden" />
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="font-light">
            <p>Welcome to the Mosh Store!</p>
          </div>
        </CardContent>
      </Card>

      <NavlinkCards />
    </div>
  );
}

export const runtime = "edge";
