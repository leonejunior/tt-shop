"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Close mobile menu on Escape key press and prevent body scroll when open
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  // Navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Readings", href: "/readings" },
    { name: "About", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Contact", href: "/contact" },
  ];

  // Check if a link is active: exact match for root, startsWith for child routes
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
          {/* Logo - Desktop */}
          <Link
            href="/"
            className="hidden text-xl font-semibold tracking-wide text-purple-800 transition-colors hover:text-purple-600 md:block md:text-2xl"
          >
            Karma&apos;s Apothecary
          </Link>

          {/* Logo - Mobile */}
          <Link
            href="/"
            className="block text-lg font-semibold tracking-wide text-purple-800 transition-colors hover:text-purple-600 md:hidden"
          >
            karma
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm transition-colors ${
                    active
                      ? "font-semibold text-primary"
                      : "font-medium text-foreground/80 hover:text-primary"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.name}
                  {active && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
            {/* CTA Button - Desktop */}
            <Link
              href="/readings"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
            >
              Book a Reading
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="rounded-md p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-primary md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div
            id="mobile-navigation-menu"
            className="relative z-50 border-t border-border bg-background px-4 pb-6 pt-3 shadow-xl md:hidden"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                      active
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-foreground/80 hover:bg-muted hover:text-primary"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{link.name}</span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
              {/* CTA Button - Mobile */}
              <Link
                href="/readings"
                onClick={closeMenu}
                className="mt-3 rounded-full bg-primary px-5 py-2.5 text-center text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Book a Reading
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop for Mobile Menu (closes on click outside) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
