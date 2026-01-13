/**
 * Header Component
 *
 * Main navigation header with categories and breaking news ticker.
 */

import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import type { Category, Article } from "@/types";
import { getCategories } from "@/services/categories.service";
import { getBreakingNews } from "@/services/news.service";
import { getCurrentBSDateString, toNepaliDigits } from "@/lib/bs-date";

export function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [breakingNews, setBreakingNews] = useState<Article[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, breaking] = await Promise.all([
          getCategories(),
          getBreakingNews(5),
        ]);
        setCategories(cats);
        setBreakingNews(breaking);
      } catch (error) {
        console.error("Failed to load header data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const currentDate = getCurrentBSDateString();
  const currentTime = new Date().toLocaleTimeString("ne-NP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar with date */}
      <div className="bg-secondary text-white text-sm py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>{currentDate}</span>
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-primary text-white overflow-hidden">
          <div className="container mx-auto px-4 flex items-center">
            <span className="bg-primary-dark px-3 py-1 font-bold whitespace-nowrap">
              ब्रेकिङ
            </span>
            <div className="overflow-hidden flex-1">
              <div className="animate-ticker flex whitespace-nowrap py-1">
                {breakingNews.map((news, index) => (
                  <Link
                    key={news.$id}
                    to={`/news/${news.slug}`}
                    className="mx-8 hover:underline"
                  >
                    {news.title}
                    {index < breakingNews.length - 1 && (
                      <span className="mx-4">●</span>
                    )}
                  </Link>
                ))}
                {/* Duplicate for seamless loop */}
                {breakingNews.map((news, index) => (
                  <Link
                    key={`dup-${news.$id}`}
                    to={`/news/${news.slug}`}
                    className="mx-8 hover:underline"
                  >
                    {news.title}
                    {index < breakingNews.length - 1 && (
                      <span className="mx-4">●</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-primary text-3xl font-bold">हाम्रो</span>
              <span className="text-secondary text-3xl font-bold">नेपाल</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                गृहपृष्ठ
              </NavLink>

              {!isLoading &&
                categories.slice(0, 8).map((category) => (
                  <NavLink
                    key={category.$id}
                    to={`/category/${category.slug}`}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-md font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {category.name}
                  </NavLink>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t py-2">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md font-medium ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                गृहपृष्ठ
              </NavLink>

              {categories.map((category) => (
                <NavLink
                  key={category.$id}
                  to={`/category/${category.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md font-medium ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {category.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
