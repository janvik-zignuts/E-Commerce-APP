"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Icon from "../ui/appIcon";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useCart } from "@/hooks/useCart";
import type { User } from "firebase/auth";
import { usePathname } from "next/navigation";

interface HeaderProps {
  currentUser?: (User & { role?: string }) | null;
  cartCount?: number;
}

const  Header=({ currentUser = null, cartCount }: HeaderProps = {}) =>{
  const { user } = useAuthUser();
  const effectiveUser = currentUser ?? user;
  const { items } = useCart({ userId: effectiveUser?.uid });

  const derivedCartCount = useMemo(
    () => cartCount ?? items.reduce((sum, item) => sum + item.quantity, 0),
    [cartCount, items],
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartAnimating, setCartAnimating] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (derivedCartCount > 0) {
      setCartAnimating(true);
      const timer = setTimeout(() => setCartAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [derivedCartCount]);

  const isAdmin = (effectiveUser as any)?.role === 'admin';
  const pathname = usePathname();

  const navigationItems = [
    {
      label: 'Shop',
      path: '/routes/product-catalog',
      icon: 'ShoppingBagIcon',
      adminOnly: false,
    },
    {
      label: 'Account',
      path: effectiveUser ? '/routes/account' : '/routes/auth/login',
      icon: 'UserIcon',
      adminOnly: false,
    },
    {
      label: 'Admin',
      path: '/admin-product-management',
      icon: 'CogIcon',
      adminOnly: true,
    },
  ];

  const visibleItems = navigationItems?.filter(
    (item) => !item?.adminOnly || (item?.adminOnly && isAdmin)
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] bg-background transition-smooth ${
        scrolled ? 'shadow-elevation-md' : 'shadow-sm'
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            href="/routes/product-catalog"
            className="flex items-center space-x-2 hover:opacity-80 transition-smooth"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"

                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"

                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-blue-600 font-heading hidden sm:block">
              FashionHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
      {visibleItems?.map((item) => {
        const isActive = pathname === item.path; // highlight when matched

        return (
          <Link
            key={item?.path}
            href={item?.path}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium min-h-touch transition-smooth
              ${
                isActive
                  ? "bg-blue-100 text-blue-600" // 🔵 highlighted style
                  : "text-text-primary hover:bg-muted"
              }
            `}
          >
            <Icon name={item?.icon} size={20} variant="outline" />
            <span>{item?.label}</span>
          </Link>
        );
      })}
    </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/routes/cart"
              className="relative p-2 hover:bg-muted rounded-md transition-smooth min-h-touch min-w-touch"
              aria-label="Shopping cart"
            >
              <Icon name="ShoppingCartIcon" size={24} variant="outline" />
              {derivedCartCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-blue-600 text-white flex items-center justify-center w-5 h-5 text-xs font-semibold text-accent-foreground bg-accent rounded-full ${
                    cartAnimating ? 'animate-pulse' : ''
                  }`}
                >
                  {derivedCartCount > 9 ? '9+' : derivedCartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 hover:bg-muted rounded-md transition-smooth min-h-touch min-w-touch"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon
                name={mobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'}
                size={24}
                variant="outline"
              />
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background shadow-elevation-md">
          <nav className="px-4 py-4 space-y-2">
            {visibleItems?.map((item) => (
              <Link
                key={item?.path}
                href={item?.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium text-text-primary hover:bg-muted transition-smooth min-h-touch"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name={item?.icon} size={24} variant="outline" />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;