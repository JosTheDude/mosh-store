import { HouseIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto flex max-w-7xl items-center gap-8 p-4 py-6">
      <Link href="/" className="flex gap-2">
        <HouseIcon weight="bold" width={20} height={20} />

        <span>Home</span>
      </Link>
    </header>
  );
}
