"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/componnets/ui/appIcon";
import AppImage from "@/componnets/ui/appImage";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => Promise<boolean>;
  isInCart?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  isInCart = false,
}: ProductCardProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const handleButtonClick = async () => {
    if (isInCart) {
      router.push("/cart");
      return;
    }

    setIsAdding(true);
    try {
      await onAddToCart(product);
    } finally {
      setIsAdding(false);
    }
  };

  const priceToShow = product.discount ? product.salePrice : product.price;

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-md transition-smooth">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-surface overflow-hidden">
        {imageLoading && <div className="absolute inset-0 shimmer bg-muted" />}

        <AppImage
          src={product.image}
          alt={product.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-layout"
          onLoad={() => setImageLoading(false)}
        />

        {product.isNew && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            New
          </span>
        )}

        {product.discount && product.discount > 0 && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-green-600 text-white  text-xs font-semibold rounded-full">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Category + Title */}
        <div >
          <span className="inline-block px-2 py-1 bg-muted text-blue-500 uppercase text-sm font-bold rounded">
            {product.category}
          </span>

          <h3 className="text-base font-semibold text-text-primary line-clamp-2 ">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                color="orange"
                name="StarIcon"
                size={16}
                variant={i < Math.floor(product.rating) ? "solid" : "outline"}
                className={
                  i < Math.floor(product.rating)
                    ? "text-warning"
                    : "text-muted-foreground"
                }
              />
            ))}
          </div>

          <span className="text-sm text-text-secondary">({product.reviews})</span>
        </div>

        {/* Pricing + Add Button */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product.discount ? (
              <>
                <p className="text-lg font-bold text-accent">
                  ${priceToShow?.toFixed(2)}
                </p>
                <p className="text-sm text-text-secondary line-through">
                  ${product?.price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-text-primary">
                ${product?.price?.toFixed(2)}
              </p>
            )}
          </div>

          <button
            onClick={handleButtonClick}
            disabled={(!isInCart && !product.inStock) || isAdding}
            aria-label={isInCart ? "Go to cart" : `Add ${product.name} to cart`}
            className={`flex items-center bg-blue-600 text-white cursor-pointer space-x-2 px-4 py-2 font-medium rounded-md min-h-touch transition-smooth disabled:opacity-50 disabled:cursor-not-allowed ${
              isInCart
                ? "bg-green-600 text-white hover:bg-green-500"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {isInCart ? (
              <>
                  <span className="text-sm">Go to Cart</span>
              </>
            ) : isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span className="text-sm">Adding...</span>
              </>
            ) : (
              <>
                <Icon name="ShoppingCartIcon" size={20} variant="outline" />
                <span className="text-sm">Add</span>
              </>
            )}
          </button>
        </div>

        {/* Out of Stock */}
        {!product.inStock && (
          <p className="text-sm text-error font-medium">Out of Stock</p>
        )}
      </div>
    </div>
  );
}
