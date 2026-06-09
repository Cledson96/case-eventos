"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonPrimary } from "@/components/ui/styles";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [{ href: "/events", label: "Eventos" }];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-background dark:border-white/10">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <BrandMark />
          <span className="text-lg font-semibold tracking-tight">Case Eventos</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background ${active
                    ? "text-brand-strong"
                    : "text-zinc-600 hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}



          <Link href="/events/new" className={buttonPrimary}>
            Criar evento
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
