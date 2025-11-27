"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { motion, AnimatePresence } from "framer-motion";

import { dbNavSections, type DbNavLink } from "@/lib/db-navigation";
import Image from "next/image";
import ThemeToggle from "@/components/theme-toggle";

type DbNavbarProps = {
  session: Session | null;
};

const primaryNav = dbNavSections.map((section) => ({
  id: section.id,
  label: section.label,
  href: section.href,
  hasDropdown: Boolean(section.columns?.length || section.standaloneLinks?.length),
  dropdown: section,
}));

const iconClasses = "h-5 w-5 text-slate-500";

export default function DbNavbar({ session }: DbNavbarProps) {
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(
    null,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleAuth = () => {
    if (session) {
      void signOut({ callbackUrl: "/" });
    } else {
      void signIn();
    }
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector(".search-container");
      if (
        searchOpen &&
        searchContainer &&
        !searchContainer.contains(event.target as Node)
      ) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        openDesktopDropdown
      ) {
        setOpenDesktopDropdown(null);
      }
    };

    if (openDesktopDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDesktopDropdown]);

  return (
    <header className="sticky top-0 z-50 font-db-screensans">
      <a
        href="#maincontent"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Zum Inhalt springen
      </a>

      <div
        ref={navRef}
        className={`relative w-full border-b border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-900 shadow-[0_4px_16px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl flex-col px-6 transition-all lg:px-8 ${
            isScrolled ? "py-1.5 lg:py-1.5" : "py-2 lg:py-2.5"
          }`}
        >
          {/* Reihe 1: Branding + Aktionen */}
          <div
            className={`flex items-center justify-between transition-all ${
              isScrolled ? "pb-1 lg:pb-1" : "pb-1.5 lg:pb-1.5"
            }`}
          >
            <Link href="/" className="flex items-center gap-2" aria-label="Startseite">
              <Image
                src="/Logo.svg"
                alt="Railnetwork.app"
                width={180}
                height={90}
                className={`transition-all ${
                  isScrolled ? "lg:w-[200px] lg:h-[70px]" : "lg:w-[200px] lg:h-[60px]"
                }`}
              />
            </Link>

            <div className="flex items-center gap-5">
              {/* Search Container */}
              <div className="search-container relative hidden lg:block">
                <motion.div
                  initial={false}
                  animate={{
                    width: searchOpen ? "360px" : isScrolled ? "40px" : "48px",
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative overflow-hidden"
                >
                  {searchOpen ? (
                    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm">
                      <SearchIcon />
                      <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Suchen..."
                        className="flex-1 border-0 bg-transparent text-base text-slate-900 placeholder-slate-400 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Suche schließen"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDesktopDropdown(null);
                        setSearchOpen(true);
                      }}
                      className={`flex items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 ${
                        isScrolled ? "h-9 w-9" : "h-10 w-10"
                      }`}
                      aria-label="Suche öffnen"
                    >
                      <SearchIcon />
                    </button>
                  )}
                </motion.div>
              </div>

              <span
                className={`hidden bg-slate-200 lg:block ${
                  isScrolled ? "h-6 w-px" : "h-8 w-px"
                }`}
              />

              <LanguageSwitch compact={true} />

              {session && (
                <>
                  <span
                    className={`hidden bg-slate-200 lg:block ${
                      isScrolled ? "h-6 w-px" : "h-8 w-px"
                    }`}
                  />
                  <Link
                    href="/dashboard"
                    className={`hidden rounded-full border border-[#e2001a] bg-[#e2001a] font-semibold text-white transition hover:bg-[#c10015] hover:border-[#c10015] lg:inline-flex items-center gap-2 ${
                      isScrolled
                        ? "px-3 py-1.5 text-sm"
                        : "px-4 py-2 text-sm"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </Link>
                </>
              )}

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  type="button"
                  className={`hidden rounded-full border border-slate-200 dark:border-slate-700/60/60 font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-100 lg:inline-flex ${
                    isScrolled
                      ? "px-3 py-1.5 text-sm"
                      : "px-4 py-2 text-sm"
                  }`}
                  onClick={handleAuth}
                >
                  {session ? "Logout" : "Login"}
                </button>
              </div>

              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700/60/60 text-slate-600 dark:text-slate-300 lg:hidden"
                aria-label="Menü öffnen"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>

          {/* Reihe 2: Navigation */}
          <nav
            className={`relative hidden w-full items-center justify-start border-t border-slate-100 transition-all lg:flex ${
              isScrolled ? "pt-1.5" : "pt-2.5"
            }`}
          >
            <ul
              className={`flex items-center gap-3 font-semibold text-slate-600 transition-all ${
                isScrolled ? "text-sm" : "text-base"
              }`}
            >
              {primaryNav.map((item) => (
                <li key={item.id} className="relative">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-2 rounded-md transition after:absolute after:left-0 after:top-full after:h-1 after:w-full after:origin-center after:scale-x-0 after:bg-[#e2001a] after:transition ${
                        isScrolled
                          ? "px-4 py-2"
                          : "px-5 py-3"
                      } ${
                        openDesktopDropdown === item.id
                          ? "text-slate-900 after:scale-x-100"
                          : "hover:text-slate-900 hover:after:scale-x-100"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                    {item.hasDropdown && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSearchOpen(false);
                          setSearchQuery("");
                          setOpenDesktopDropdown((prev) =>
                            prev === item.id ? null : item.id,
                          );
                        }}
                        className={`flex items-center justify-center rounded-md transition ${
                          isScrolled ? "p-1.5" : "p-2"
                        } ${
                          openDesktopDropdown === item.id
                            ? "text-slate-900"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                        aria-expanded={openDesktopDropdown === item.id}
                        aria-label={`${item.label} Menü ${openDesktopDropdown === item.id ? "schließen" : "öffnen"}`}
                      >
                        <ChevronIcon
                          className={`transition-transform ${
                            isScrolled ? "h-4 w-4" : "h-4 w-4"
                          } ${
                            openDesktopDropdown === item.id ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mega-Menü außerhalb des Containers, direkt unter der Navbar, volle Breite */}
        <AnimatePresence>
          {openDesktopDropdown && (() => {
            const activeItem = primaryNav.find(
              (item) => item.id === openDesktopDropdown,
            );
            return activeItem?.dropdown ? (
              <DropdownPanel key={openDesktopDropdown} section={activeItem.dropdown} />
            ) : null;
          })()}
        </AnimatePresence>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => {
          setMobileMenuOpen(false);
          setMobileDropdown(null);
        }}
        mobileDropdown={mobileDropdown}
        onToggleDropdown={(id) =>
          setMobileDropdown((prev) => (prev === id ? null : id))
        }
        handleAuth={handleAuth}
        session={session}
      />
    </header>
  );
}

function DropdownPanel({ section }: { section: (typeof dbNavSections)[number] }) {
  const [activeSubMenu, setActiveSubMenu] = useState<DbNavLink | null>(null);
  const entries: DbNavLink[] = [
    ...(section.columns?.flatMap((column) => column.links) ?? []),
    ...(section.standaloneLinks ?? []),
  ];

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="absolute left-0 right-0 top-full mt-0 w-full border-b border-slate-200 bg-white text-slate-700 shadow-2xl shadow-slate-600/10"
      onMouseLeave={() => setActiveSubMenu(null)}
    >
      <div className="mx-auto flex max-w-7xl gap-12 px-8 py-10">
        {/* Linke Spalte: Übersicht */}
        <div className="w-64">
          <p className="text-2xl font-semibold text-slate-900">{section.label}</p>
          <p className="mt-4 text-base text-slate-500">
            {section.intro ?? "Überblick & Highlights"}
          </p>
        </div>

        {/* Mittlere Spalte: Hauptlinks - feste Breite */}
        <div className="w-[28rem] flex-shrink-0">
          <ul className="overflow-hidden rounded-xl border border-slate-100">
            {entries.map((link) => {
              const isActive = activeSubMenu?.label === link.label;
              return (
                <li
                  key={link.label}
                  className={isActive ? "bg-[#e2001a]/10" : ""}
                  onMouseEnter={() =>
                    link.subLinks && link.subLinks.length > 0
                      ? setActiveSubMenu(link)
                      : setActiveSubMenu(null)
                  }
                >
                  <DropdownRow
                    link={link}
                    hasSubMenu={Boolean(link.subLinks?.length)}
                    isActive={isActive}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        {/* Rechte Spalte: Sub-Menü - feste Breite */}
        <div className="w-72 flex-shrink-0">
          <AnimatePresence mode="wait">
            {activeSubMenu && activeSubMenu.subLinks && (
              <SubMenu
                key={activeSubMenu.label}
                link={activeSubMenu}
                onClose={() => setActiveSubMenu(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function DropdownRow({
  link,
  hasSubMenu,
  isActive,
}: {
  link: DbNavLink;
  hasSubMenu: boolean;
  isActive: boolean;
}) {
  const content = (
    <div
      className={`group relative flex w-full items-center justify-between px-6 py-5 text-lg font-medium transition ${
        isActive ? "text-slate-900" : "text-slate-800"
      }`}
    >
      <span className="relative">
        {link.label}
        <span className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-[#e2001a] transition-transform group-hover:scale-x-100" />
        {isActive && hasSubMenu && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e2001a]" />
        )}
      </span>
      {hasSubMenu ? (
        <ChevronIcon className="h-4 w-4 rotate-0" />
      ) : (
        <ArrowIcon />
      )}
    </div>
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className="block hover:bg-slate-50">
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className="block hover:bg-slate-50">
      {content}
    </Link>
  );
}

function SubMenu({
  link,
  onClose,
}: {
  link: DbNavLink;
  onClose: () => void;
}) {
  if (!link.subLinks || link.subLinks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <button
        type="button"
        onClick={onClose}
        className="mb-6 flex items-center gap-2 text-base font-semibold text-slate-700 transition hover:text-slate-900"
      >
        <BackArrowIcon />
        Zurück
      </button>

      <ul className="overflow-hidden rounded-xl border border-slate-100">
        {link.subLinks.map((subLink) => (
          <li key={subLink.label}>
            {subLink.external ? (
              <a
                href={subLink.href}
                target="_blank"
                rel="noreferrer"
                className="group flex w-full items-center justify-between px-6 py-5 text-lg font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <span className="relative">
                  {subLink.label}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-[#e2001a] transition-transform group-hover:scale-x-100" />
                </span>
                <OutboundIcon />
              </a>
            ) : (
              <Link
                href={subLink.href}
                className="group flex w-full items-center justify-between px-6 py-5 text-lg font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <span className="relative">
                  {subLink.label}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-[#e2001a] transition-transform group-hover:scale-x-100" />
                </span>
                <ArrowIcon />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  mobileDropdown: string | null;
  onToggleDropdown: (id: string) => void;
  handleAuth: () => void;
  session: Session | null;
};

function MobileMenu({
  isOpen,
  onClose,
  mobileDropdown,
  onToggleDropdown,
  handleAuth,
  session,
}: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition duration-300 lg:hidden ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-y-0 left-0 w-full max-w-md transform bg-white text-slate-900 transition duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Menü
          </p>
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-slate-200"
            onClick={onClose}
            aria-label="Menü schließen"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="h-[calc(100vh-5rem)] overflow-y-auto px-4 pb-16 pt-6">
          <ul className="space-y-2">
            {primaryNav.map((item) => (
              <li key={item.id} className="rounded-2xl border border-slate-100 bg-white">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-semibold"
                  onClick={() =>
                    item.hasDropdown
                      ? onToggleDropdown(item.id)
                      : window.location.assign(item.href)
                  }
                  aria-expanded={mobileDropdown === item.id}
                >
                  {item.label}
                  {item.hasDropdown ? (
                    <ChevronIcon
                      className={`transition ${
                        mobileDropdown === item.id ? "rotate-90" : ""
                      }`}
                    />
                  ) : (
                    <ArrowIcon />
                  )}
                </button>

                {item.hasDropdown && mobileDropdown === item.id && item.dropdown.columns && (
                  <div className="space-y-6 border-t border-slate-100 px-4 py-4 text-sm text-slate-600">
                    {item.dropdown.columns.map((column) => (
                      <div key={column.heading}>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          {column.heading}
                        </p>
                        <ul className="mt-3 space-y-2">
                          {column.links.map((link) => (
                            <li key={link.label}>
                              <MobileNavLink link={link} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-4">
            {session && (
              <Link
                href="/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#e2001a] bg-[#e2001a] px-4 py-3 font-semibold text-white transition hover:bg-[#c10015]"
                onClick={onClose}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>
            )}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 font-semibold text-slate-800"
              onClick={handleAuth}
            >
              {session ? "Logout" : "Login"}
            </button>
            <LanguageSwitch compact />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNavLink({ link }: { link: DbNavLink }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-600 hover:border-slate-300 hover:text-slate-900"
      >
        {link.label}
        <OutboundIcon />
      </a>
    );
  }

  return (
    <Link
      href={link.href}
      className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm text-slate-600 hover:border-slate-300 hover:text-slate-900"
    >
      {link.label}
      <ChevronIcon />
    </Link>
  );
}

function LanguageSwitch({ compact }: { compact?: boolean }) {
  return (
    <details className="group relative z-50">
      <summary
        className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 ${
          compact
            ? "justify-center px-3 py-1.5 text-sm"
            : "px-4 py-2 text-sm"
        }`}
      >
        <GlobeIcon />
        {!compact && <span>DE</span>}
      </summary>
      <menu className="absolute right-0 z-50 mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-lg shadow-slate-900/5">
        <li>
          <Link
            href="/de"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-900"
          >
            Deutsch
            <span className="text-xs uppercase text-[#e2001a]">Aktiv</span>
          </Link>
        </li>
        <li>
          <a
            href="https://www.deutschebahn.com/en"
            className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-50"
          >
            English
            <OutboundIcon />
          </a>
        </li>
      </menu>
    </details>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconClasses} ${className}`} aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClasses} aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5 text-slate-700" aria-hidden="true">
      <path
        d="M6 6l12 12M6 18L18 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClasses} aria-hidden="true">
      <path
        d="M11 17a6 6 0 100-12 6 6 0 000 12zm5 1l4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClasses} aria-hidden="true">
      <path
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <path
        d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function OutboundIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClasses} aria-hidden="true">
      <path
        d="M7 17L17 7m0 0h-7m7 0v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
