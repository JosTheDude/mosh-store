"use client";

import { api } from "~/trpc/react";

import { useAuthDialog } from "~/stores/useAuthDialog";

import AuthDialogMinecraft from "./methods/auth-dialog-minecraft";
import AuthDialogSteam from "./methods/auth-dialog-steam";

export default function AuthDialog() {
  const authDialog = useAuthDialog();

  const { data: store } = api.paynow.getStore.useQuery();

  return (
    <>
      {store?.game?.includes("minecraft") ? (
        <AuthDialogMinecraft
          open={authDialog.isOpen}
          setOpen={authDialog.setOpen}
        />
      ) : (
        <AuthDialogSteam
          open={authDialog.isOpen}
          setOpen={authDialog.setOpen}
        />
      )}
    </>
  );
}
