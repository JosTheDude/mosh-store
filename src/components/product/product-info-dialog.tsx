"use client";

import { ShoppingCartIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatCents } from "~/lib/money";
import type Product from "~/server/api/types/paynow/product";
import { api } from "~/trpc/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";

export default function ProductInfoDialog({
  product,
  open,
  setOpen,
  onAddToCart,
}: {
  product: Product;
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddToCart?: () => void;
}) {
  const { data: auth } = api.paynow.getAuth.useQuery();

  const normalizedProductName = product.name.toLowerCase();

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent
        className="!max-w-5xl !w-full !border-none !shadow-none !outline-none !ring-0 !bg-transparent max-h-[85vh] overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid min-h-[600px] w-full gap-0 overflow-hidden rounded-lg lg:grid-cols-2">
          {/* Left side - Product image */}
          <div className="flex flex-col bg-gray-900 p-8 lg:col-span-1">
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-md rounded-lg bg-gray-900/80 p-8 text-center backdrop-blur-sm">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="mx-auto mb-6 max-h-48 max-w-48 object-contain"
                  />
                ) : (
                  <div className="mx-auto mb-6 flex h-48 w-48 items-center justify-center rounded-lg bg-purple-600/30">
                    <ShoppingCartIcon className="h-24 w-24 text-purple-300" />
                  </div>
                )}

                <h2 className="mb-3 font-bold text-2xl text-white">
                  {product.name}
                </h2>
                <div className="font-semibold text-lg text-purple-200">
                  {product.pricing?.active_sale ? (
                    <div className="space-y-1">
                      <div className="text-red-300 text-sm line-through">
                        {formatCents(
                          product.pricing.price_original,
                          product.currency,
                        )}
                      </div>
                      <div className="text-green-300 text-xl">
                        {formatCents(
                          product.pricing.price_final,
                          product.currency,
                        )}
                      </div>
                      <div className="text-purple-300 text-sm">
                        Save{" "}
                        {product.pricing.active_sale.discount_type ===
                        "percentage"
                          ? `${product.pricing.active_sale.discount_amount}%`
                          : formatCents(
                              product.pricing.active_sale.discount_amount,
                              product.currency,
                            )}
                      </div>
                    </div>
                  ) : (
                    formatCents(product.price, product.currency)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Product details */}
          <div className="flex flex-col overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:col-span-1 dark:from-gray-900 dark:to-gray-800">
            <div className="flex-1 space-y-3">
              <div className="mb-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-xl">{product.name}</h3>
                  </div>
                  {/* Close button inline with product name */}
                  <DialogClose
                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                    tabIndex={-1}
                  >
                    <XIcon className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </div>
              </div>
            </div>

            {/* Bottom section with price and purchase button */}
            <div className="mt-4 border-gray-200 border-t pt-4 dark:border-gray-700">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {product.pricing?.active_sale ? (
                    <div className="space-y-1">
                      <div className="text-lg text-red-500 line-through">
                        {formatCents(
                          product.pricing.price_original,
                          product.currency,
                        )}
                      </div>
                      <p className="font-bold text-2xl text-green-600">
                        {formatCents(
                          product.pricing.price_final,
                          product.currency,
                        )}
                      </p>
                      <div className="text-gray-600 text-sm dark:text-gray-400">
                        {product.pricing.active_sale.name} - Save{" "}
                        {product.pricing.active_sale.discount_type ===
                        "percentage"
                          ? `${product.pricing.active_sale.discount_amount}%`
                          : formatCents(
                              product.pricing.active_sale.discount_amount,
                              product.currency,
                            )}
                      </div>
                    </div>
                  ) : (
                    <p className="font-bold text-xl">
                      {formatCents(product.price, product.currency)}
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={onAddToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 py-2 font-semibold text-base text-white hover:from-purple-700 hover:to-purple-800"
                size="lg"
                tabIndex={0}
              >
                <ShoppingCartIcon className="mr-3 h-6 w-6" />
                {auth ? "Add to Cart" : "Login to Purchase"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
