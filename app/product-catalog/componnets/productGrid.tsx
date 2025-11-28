'use client';

import ProductCard from './productCard';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => Promise<boolean>;
  isLoading?: boolean;
  cartProductIds?: Set<string>;
}

export default function ProductGrid({
  products,
  onAddToCart,
  isLoading = false,
  cartProductIds,
}: ProductGridProps) {
 
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <div className="aspect-[3/4] bg-muted shimmer" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded shimmer w-1/3" />
              <div className="h-6 bg-muted rounded shimmer w-3/4" />
              <div className="h-4 bg-muted rounded shimmer w-1/2" />
              <div className="flex items-center justify-between">
                <div className="h-6 bg-muted rounded shimmer w-1/4" />
                <div className="h-10 bg-muted rounded shimmer w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }


  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          No products found
        </h3>
        <p className="text-text-secondary text-center max-w-md">
          Try adjusting your filters or search criteria to find what you're looking for.
        </p>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          isInCart={cartProductIds?.has(product.id)}
        />
      ))}
    </div>
  );
}
