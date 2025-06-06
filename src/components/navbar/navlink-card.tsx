"use client";

import { ArrowCircleDownIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { api } from "~/trpc/react";
import { Card, CardContent } from "./../ui/card";

export default function NavlinkCard() {
  const { data: navlinks } = api.paynow.getNavlinks.useQuery();

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex flex-col space-y-6">
          {(navlinks || []).map((navlink) => (
            <React.Fragment key={navlink.tag_id}>
              {navlink.children.length ? (
                <Collapsible>
                  <CollapsibleTrigger className="group flex w-full items-center justify-normal gap-3 font-semibold text-lg">
                    <Link
                      className="flex-1 text-left"
                      href={`/category/${navlink.tag_slug}`}
                    >
                      {navlink.name}
                    </Link>

                    <span className="transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180">
                      <ArrowCircleDownIcon weight="bold" />
                    </span>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-6 ml-3 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <div className="flex flex-col space-y-3">
                      {navlink.children.map((childNavlink) => (
                        <Link
                          key={childNavlink.tag_id}
                          className="justify-normal font-semibold text-lg"
                          href={`/category/${childNavlink.tag_slug}`}
                        >
                          {childNavlink.name}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  className="justify-normal font-semibold text-lg"
                  href={`/category/${navlink.tag_slug}`}
                >
                  {navlink.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
