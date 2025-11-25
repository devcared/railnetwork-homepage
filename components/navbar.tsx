"use client";

import { useState } from "react";
import Link from "next/link";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

const navigation = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
];

type NavbarProps = {
  session: Session | null;
};

export default function Navbar({ session }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAuth = () => {
    if (session) {
      void signOut({ callbackUrl: "/" });
    } else {
      void signIn();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          railnetwork.
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-200 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleAuth}
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            {session ? "Logout" : "Login"}
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
          aria-label="Navigationsmenü"
          aria-expanded={isOpen}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {isOpen ? (
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4 text-base font-medium text-slate-200">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-2 transition hover:bg-white/5 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                handleAuth();
              }}
              className="rounded-full border border-white/30 px-5 py-2 text-left font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              {session ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

