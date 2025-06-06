"use client";

import {
  ShoppingBagOpenIcon,
  SignOutIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import { formatCents } from "~/lib/money";
import { useCartSidebar } from "~/stores/useCartSidebar";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function CartSheet() {
  const utils = api.useUtils();

  const cartSidebar = useCartSidebar();

  const { data: cart, isFetching: cartLoading } = api.paynow.getCart.useQuery();

  const updateCartMutation = api.paynow.updateCartItem.useMutation({
    onSuccess: async () => {
      await utils.paynow.getCart.invalidate();
    },
  });

  const checkoutMutation = api.paynow.checkout.useMutation({
    onSuccess: (result) => {
      window.location.href = result.url;
    },
    onError: (result) => {
      toast(result.message);
    },
  });

  const logoutMutation = api.paynow.logout.useMutation({
    onSuccess: async () => {
      await utils.paynow.getAuth.reset();

      cartSidebar.setOpen(false);
    },
  });

  const totalCents = React.useMemo(
    () =>
      cart?.lines?.reduce((sum, line) => sum + line.quantity * line.price, 0) ||
      0,
    [cart?.lines],
  );

  return (
    <Sheet open={cartSidebar.isOpen} onOpenChange={cartSidebar.setOpen}>
      <SheetContent className="[&>button:first-of-type]:hidden">
        <SheetHeader>
          <div className="flex items-center gap-6">
            <SheetTitle className="flex-1">Cart</SheetTitle>

            <Button
              variant={"outline"}
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <SignOutIcon weight="bold" />
              {logoutMutation.isPending ? "Logging out..." : "Log out"}
            </Button>
          </div>

          {cartLoading ? (
            <Skeleton className="mt-3 h-28 w-full rounded-sm" />
          ) : (
            <div className="mt-3 space-y-3">
              {cart?.lines.map((cartLine) => (
                <Card key={cartLine.line_key} className="gap-1">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle>{cartLine.name}</CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p className="font-semibold text-green-500">
                          {formatCents(
                            cartLine.price * cartLine.quantity,
                            cart.currency,
                          )}
                        </p>
                      </CardContent>
                    </div>

                    <div className="mr-6 flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"ghost"}>{cartLine.quantity}</Button>
                        </PopoverTrigger>

                        <PopoverContent className="grid w-28 grid-cols-2">
                          {[1, 2, 3, 4, 5, 10, 15, 20].map((quantity) => (
                            <Button
                              size={"sm"}
                              variant={"ghost"}
                              key={quantity}
                              className="mx-auto text-sm"
                              disabled={updateCartMutation.isPending}
                              onClick={() =>
                                updateCartMutation.mutate({
                                  product_id: cartLine.product_id,
                                  gameserver_id:
                                    cartLine.selected_gameserver_id,
                                  quantity,
                                  increment: false,
                                })
                              }
                            >
                              {quantity}
                            </Button>
                          ))}
                        </PopoverContent>
                      </Popover>

                      <Button
                        variant={"ghost"}
                        className="text-destructive hover:text-destructive"
                        disabled={updateCartMutation.isPending}
                        onClick={() =>
                          updateCartMutation.mutate({
                            product_id: cartLine.product_id,
                            quantity: 0,
                            increment: false,
                          })
                        }
                      >
                        <TrashIcon weight="bold" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {!cart?.lines.length && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <ShoppingBagOpenIcon className="text-7xl" />

                  <p>Your cart is empty. Get shopping!</p>
                </div>
              )}
            </div>
          )}
        </SheetHeader>

        <SheetFooter className="space-y-1">
          <div className="flex items-center gap-6">
            <p className="flex-1 font-bold">Total</p>

            <p>{formatCents(totalCents, cart?.currency)}</p>
          </div>

          <Button
            variant={"default"}
            onClick={() =>
              checkoutMutation.mutate({
                subscription: false,
                lines: cart?.lines || [],
              })
            }
            disabled={checkoutMutation.isPending || !cart || !cart.lines.length}
          >
            {checkoutMutation.isPending ? "Checking Out..." : "Checkout"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
