"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Readings", href: "/readings" },
    { name: "About", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Contact", href: "/contact" },
  ];

  // Check if a link is active (exact match for home, startsWith for others)
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-border bg-background/95 backdrop-blur-sm border-b">
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
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) && link.name !== "Home"
                  ? "text-primary"
                  : "text-foreground/80"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {/* CTA Button - Desktop */}
          <Link
            href="/readings"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Book a Reading
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="rounded-md p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-primary md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background px-4 pb-5 pt-3 shadow-lg md:hidden">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className={`py-2 text-base font-medium transition-colors hover:text-primary ${
                  isActive(link.href) && link.name !== "Home"
                    ? "text-primary"
                    : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* CTA Button - Mobile */}
            <Link
              href="/readings"
              onClick={closeMenu}
              className="mt-2 rounded-full bg-primary px-5 py-2.5 text-center text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book a Reading
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
