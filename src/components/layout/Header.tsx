"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_ITEMS, SITE_CONFIG } from "@/constants/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-700">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              관리자
            </Link>
            <Link
              href="/reservation"
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              예약하기
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="px-2 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                관리자
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
