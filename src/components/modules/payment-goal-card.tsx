"use client";

import type Module from "~/server/api/types/paynow/module";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function PaymentGoalCard({
  module,
}: {
  module: Module<"payment_goal">;
}) {
  const { data: store } = api.paynow.getStore.useQuery();

  const goal = (module.data.settings.goalTarget / 100).toFixed(2);
  const revenue = (+(module.data.revenue ?? "0") / 100).toFixed(2);

  const percentCompleted = Math.min((+revenue / +goal) * 100, 100);
  const showAbsoluteAmounts = module.data.settings.displayAbsoluteGoalAmount;

  return (
    <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text font-bold text-transparent text-white text-xl uppercase tracking-wide">
            {module.data.settings.header}
          </CardTitle>
          {!showAbsoluteAmounts && (
            <div className="text-right">
              <p className="font-bold text-2xl text-white">
                {percentCompleted.toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-0">
        {showAbsoluteAmounts && (
          <div className="text-center">
            <h2 className="font-bold text-2xl text-foreground">
              {revenue}{" "}
              <span className="text-lg text-muted-foreground">
                {store?.currency.toUpperCase()}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm">Current Progress</p>
          </div>
        )}

        <div className="relative">
          <div className="h-4 w-full overflow-hidden rounded-full bg-secondary/50 shadow-inner">
            <div
              className="relative h-4 overflow-hidden rounded-full shadow-lg transition-all duration-500 ease-out"
              style={{
                width: `${percentCompleted}%`,
                background:
                  "linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent)",
                backgroundSize: "12px 12px",
                backgroundColor: "#7f22fe",
                animation: "stripeMove 2s linear infinite",
                boxShadow:
                  percentCompleted > 0
                    ? "0 0 12px rgba(var(--primary), 0.4)"
                    : "none",
              }}
            />
          </div>
          {percentCompleted >= 100 && (
            <div className="absolute inset-0 animate-pulse">
              <div className="h-4 w-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          )}
        </div>

        {showAbsoluteAmounts && (
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="font-medium text-muted-foreground text-sm">Goal</p>
              <p className="font-semibold text-foreground">
                {goal}{" "}
                <span className="text-muted-foreground text-sm">
                  {store?.currency.toUpperCase()}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-muted-foreground text-sm">
                Progress
              </p>
              <p className="font-bold text-lg text-white">
                {percentCompleted.toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Decorative background elements */}
      <div className="-right-4 -top-4 pointer-events-none absolute h-24 w-24 rounded-full bg-primary/5" />
      <div className="-bottom-6 -left-6 pointer-events-none absolute h-20 w-20 rounded-full bg-primary/3" />
    </Card>
  );
}
