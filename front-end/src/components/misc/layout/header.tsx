"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import Logo from "./logo";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <Button size="sm" asChild>
          <Link href="/login">Acessar</Link>
        </Button>
      </nav>
    </header>
  );
}
