import { DiscordLogoIcon, SparkleIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import { env } from "~/env";

const USEFUL_LINKS = [
  {
    name: "Official Discord",
    href: env.NEXT_PUBLIC_DISCORD_INVITE_URL,
    target: "_blank",
    rel: "noreferrer",
  },
  {
    name: "Terms Of Use",
    href: "https://paynow.gg/terms-of-use",
    target: "_blank",
    rel: "noreferrer",
  },
  {
    name: "User Agreement",
    href: "https://paynow.gg/user-agreement",
    target: "_blank",
    rel: "noreferrer",
  },
  {
    name: "Privacy Policy",
    href: "https://paynow.gg/privacy-policy",
    target: "_blank",
    rel: "noreferrer",
  },
];

const VOTING_SITES = [
  {
    name: "Coming Soon...",
    href: "https://mosh.gg/",
    target: "",
    rel: "noreferrer",
  },
];

const Footer = () => {
  return (
    <div className="mt-16 flex flex-col border-t bg-card shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)]">
      <footer>
        <div className="mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 px-6 py-12 md:grid-cols-4 xl:px-0">
            <div>
              <h6>
                <Link
                  href="/about"
                  className="transition-colors hover:text-foreground"
                >
                  Description
                </Link>
              </h6>

              <p className="mt-4 text-muted-foreground text-sm">
                Mosh is a minigames network based around
                quick and fun bite-sized games
                with persistent progression!
              </p>

              <p className="mt-2 text-muted-foreground text-sm">
                Are you a parent? Learn more about what your child is purchasing{" "}
                <Link
                  href="https://l.starnova.dev/mosh/parents"
                  className="text-foreground hover:underline"
                >
                  here
                </Link>
                .
              </p>
            </div>

            <div>
              <h6>Useful Links</h6>

              <ul className="mt-4 space-y-2 text-sm">
                {USEFUL_LINKS.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6>Voting Sites</h6>

              <ul className="mt-4 space-y-2 text-sm">
                {VOTING_SITES.map((site) => (
                  <li key={site.name}>
                    <Link
                      href={site.href}
                      target={site.target}
                      rel={site.rel}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {site.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6>Contact Us</h6>

              <p className="mt-4 text-muted-foreground text-sm">
                If you have any questions or need assistance, feel free to reach
                out to us through Discord or email.
              </p>
              <p className="mt-2 text-muted-foreground text-sm">
                You can contact us at{" "}
                <Link
                  href="mailto:support@mosh.gg"
                  className="text-foreground hover:underline"
                >
                  support@mosh.gg
                </Link>
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-6 py-8 sm:flex-row xl:px-0">
            <div className="flex flex-col">
              <span className="text-m text-muted-foreground">
                &copy; {new Date().getFullYear()}{" "}
                <Link
                  href="https://starnova.dev"
                  className="text-foreground hover:underline"
                  target="_blank"
                >
                  Starnova Studios
                </Link>{" "}
                | All rights reserved.
              </span>
              <span className="text-muted-foreground text-sm">
                Mosh is not an official Minecraft product. Mosh is
                not approved by or associated with Mojang or Microsoft.
              </span>
              <span className="text-muted-foreground text-sm">
                This websites' checkout process is owned & operated by{" "}
                <Link
                  href="https://paynow.gg"
                  className="text-foreground hover:underline"
                  target="_blank"
                >
                  PayNow Services
                </Link>
                , who handle product fulfilment, billing support and refunds.
              </span>

              <span className="mt-2 text-muted-foreground text-sm">
                All payments are final and non-refundable. Attempting a
                chargeback or fraud will result in permanent ban from Mosh
                and potentially other PayNow stores.
              </span>
            </div>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link
                href={env.NEXT_PUBLIC_DISCORD_INVITE_URL}
                target="_blank"
                title="Official Discord"
              >
                <DiscordLogoIcon className="h-5 w-5" />
              </Link>
              <Link
                href="https://jos.gg/"
                target="_blank"
                rel="noreferrer"
                title="Built by Jos"
                className="transition-colors hover:text-foreground"
              >
                <SparkleIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
