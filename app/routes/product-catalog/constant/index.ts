import { SortOptionId } from "../interface";

export const CATEGORIES = [
  { id: "all", label: "All Products", count: 156 },
  { id: "mens", label: "Men's Fashion", count: 64 },
  { id: "womens", label: "Women's Fashion", count: 72 },
  { id: "accessories", label: "Accessories", count: 20 },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const COLORS = [
  { id: "black", label: "Black", hex: "#000000" },
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "red", label: "Red", hex: "#DC2626" },
  { id: "blue", label: "Blue", hex: "#2563EB" },
  { id: "green", label: "Green", hex: "#059669" },
  { id: "gray", label: "Gray", hex: "#6B7280" },
];

export const BRANDS = [
  { id: "nike", label: "Nike", count: 28 },
  { id: "adidas", label: "Adidas", count: 24 },
  { id: "zara", label: "Zara", count: 32 },
  { id: "hm", label: "H&M", count: 26 },
  { id: "uniqlo", label: "Uniqlo", count: 22 },
];


 export const sortOptions: { id: SortOptionId; label: string }[] = [
    { id: "relevance", label: "Relevance" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "newest", label: "Newest Arrivals" },
    { id: "rating", label: "Customer Rating" },
  ];