import type { Product } from "@/types/product";

export interface Filters {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  brands: string[];
}

export interface FilterPanelProps {
  filters: Filters;
  productCount: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onFilterChange: (newFilters: Filters) => void;
}

export interface SectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}


export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => Promise<boolean>;
  isInCart?: boolean;
}


export interface ProductCatalogInteractiveProps {
  initialProducts: Product[];
}

export interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => Promise<boolean>;
  isLoading?: boolean;
  cartProductIds?: Set<string>;
}

export type SortOptionId =
  | "relevance"
  | "price-low"
  | "price-high"
  | "newest"
  | "rating";

export interface SortControlsProps {
  sortBy: SortOptionId;
  onSortChange: (value: SortOptionId) => void;
  onFilterToggle: () => void;
}