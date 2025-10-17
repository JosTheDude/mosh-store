"use client";

import { SignInIcon } from "@phosphor-icons/react/dist/ssr";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuthDialog } from "~/stores/useAuthDialog";
import { useCartSidebar } from "~/stores/useCartSidebar";
import { type RouterInputs, api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

type MinecraftLoginInput = RouterInputs["paynow"]["minecraftLogin"];

export default function AuthDialogMinecraft({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const utils = api.useUtils();

  const authDialog = useAuthDialog();
  const cartSidebar = useCartSidebar();

  const form = useForm<MinecraftLoginInput>({
    defaultValues: {
      username: "",
      platform: "java",
    },
  });

  const minecraftLoginMutation = api.paynow.minecraftLogin.useMutation({
    onSuccess: async () => {
      form.reset();
      authDialog.setOpen(false);

      // Invalidate and refetch auth queries to update the UI state
      await Promise.all([
        utils.paynow.getAuth.invalidate(),
        utils.paynow.getCart.invalidate(),
        utils.paynow.getAuth.refetch(),
        utils.paynow.getCart.refetch(),
      ]);
    },
    onError: (error) => {
      form.setFocus("username");
    },
  });

  const onSubmit = (data: MinecraftLoginInput) => {
    minecraftLoginMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="font-semibold text-lg">
              Enter your Minecraft username
            </DialogTitle>
            <DialogDescription>
              Enter your username, case sensitive
            </DialogDescription>
          </DialogHeader>

          {minecraftLoginMutation.error?.message && (
            <p className="text-red-500 text-sm">
              {minecraftLoginMutation.error.message.includes("400")
                ? "Did not find the requested username. Is it spelt correctly?"
                : minecraftLoginMutation.error.message}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <Button
              type="button"
              variant={
                form.watch("platform") === "java" ? "default" : "outline"
              }
              size="sm"
              className="px-2 text-xs sm:px-4 sm:text-sm"
              onClick={() => form.setValue("platform", "java")}
            >
              <span className="hidden sm:inline">Java Edition</span>
              <span className="sm:hidden">Java</span>
            </Button>

            <Button
              type="button"
              variant={
                form.watch("platform") === "bedrock" ? "default" : "outline"
              }
              size="sm"
              className="px-2 text-xs sm:px-4 sm:text-sm"
              onClick={() => form.setValue("platform", "bedrock")}
            >
              <span className="hidden sm:inline">Bedrock Edition</span>
              <span className="sm:hidden">Bedrock</span>
            </Button>
          </div>

          <Input
            placeholder="Enter Username"
            {...form.register("username", { required: "Username is required" })}
            autoFocus
            required
          />

          <DialogFooter className="w-full flex-row items-center gap-3">
            {form.watch("platform") === "bedrock" && (
              <p className="flex-1 text-left text-muted-foreground text-xs">
                Bedrock Edition includes phones, consoles, tablets, and Windows
                10 Edition.
              </p>
            )}

            <Button
              type="submit"
              disabled={
                cartSidebar.pendingItemLoading ||
                minecraftLoginMutation.isPending ||
                !form.watch("username").trim()
              }
              className="ml-auto"
            >
              <SignInIcon />
              {cartSidebar.pendingItemLoading ||
              minecraftLoginMutation.isPending
                ? "Logging In..."
                : "Login"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
