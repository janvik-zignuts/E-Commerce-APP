'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import FilterPanel from './filterPanel';
import SortControls, { SortOptionId } from './sortControl';
import ProductGrid from './productGrid';
import type { Product } from '@/types/product';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useCart } from '@/hooks/useCart';

export interface Filters {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  brands: string[];
}

interface ProductCatalogInteractiveProps {
  initialProducts: Product[];
}


export default function ProductCatalogInteractive({
  initialProducts,
}: ProductCatalogInteractiveProps) {
  const { user } = useAuthUser();
  const { addItem, items: cartItems } = useCart({ userId: user?.uid });

  const [products] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOptionId>('relevance');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const cartProductIds = useMemo(
    () => new Set(cartItems.map(item => item.id)),
    [cartItems],
  );

  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    priceRange: [0, 500],
    sizes: [],
    colors: [],
    brands: [],
  });

 
  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortBy, products]);

  const applyFiltersAndSort = () => {
    setIsLoading(true);

    setTimeout(() => {
      let filtered = [...products];

      // Category Filter
      if (filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category);
      }

      // Price Filter
      filtered = filtered.filter(
        p =>
          p.price >= filters.priceRange[0] &&
          p.price <= filters.priceRange[1]
      );

      // Sizes Filter
      if (filters.sizes.length > 0) {
        filtered = filtered.filter(p =>
          p.sizes.some(size => filters.sizes.includes(size))
        );
      }

      // Colors Filter
      if (filters.colors.length > 0) {
        filtered = filtered.filter(p =>
          p.colors.some(c => filters.colors.includes(c))
        );
      }

      // Brands Filter
      if (filters.brands.length > 0) {
        filtered = filtered.filter(p => filters.brands.includes(p.brand));
      }

      // Sorting
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;

        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;

        case 'newest':
          filtered.sort(
            (a, b) =>
              new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
          break;

        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;

        default:
          break;
      }

      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 300);
  };


  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

 
  const handleSortChange = (newSortBy: SortOptionId) => {
    setSortBy(newSortBy);
  };


  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setToast({
        type: 'error',
        message: 'Please sign in to add items to your cart.',
      });
      return false;
    }

    try {
      await addItem(product);
      setToast({
        type: 'success',
        message: `${product.name} added to your cart.`,
      });
      return true;
    } catch (error: any) {
      setToast({
        type: 'error',
        message: error?.message || 'Unable to add item to cart. Please try again.',
      });
      return false;
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px]">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-600 lg:text-4xl font-bold">Fashion Collection</h1>
          <p className="text-gray-500">Discover the latest trends in fashion and style</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* 🔹 Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            productCount={filteredProducts.length}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
          />

          <div className="flex-1 space-y-6">

            {/* 🔹 Sort Controls */}
            <SortControls
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onFilterToggle={() => setIsMobileFilterOpen(true)}
            />

            {/* 🔹 Product Grid */}
            <ProductGrid
              products={filteredProducts as Product[]}
              onAddToCart={handleAddToCart}
              isLoading={isLoading}
              cartProductIds={cartProductIds}
            />

            {/* 🔹 Load More Button */}
            {filteredProducts.length > 0 && !isLoading && (
              <div className="flex justify-center pt-8">
                <button className="px-6 py-3  rounded-md cursor-pointer bg-blue-500 text-white">
                Show More Products
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[1100] w-full max-w-sm rounded-lg border shadow-lg p-4 text-sm text-white ${
            toast.type === 'success' ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500'
          }`}
        >
          <p className="font-medium">{toast.message}</p>
         
        </div>
      )}
    </div>
  );
}
