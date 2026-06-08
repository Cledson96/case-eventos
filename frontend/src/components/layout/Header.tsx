import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Case Eventos
        </Link>
        <Link href="/events" className="text-sm font-medium hover:underline">
          Eventos
        </Link>
      </nav>
    </header>
  );
}
