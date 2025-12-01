"use client";

import { useState } from "react";
import Icon from "@/componnets/ui/appIcon";



export interface Filters {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  brands: string[];
}

interface FilterPanelProps {
  filters: Filters;
  productCount: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onFilterChange: (newFilters: Filters) => void;
}


const CATEGORIES = [
  { id: "all", label: "All Products", count: 156 },
  { id: "mens", label: "Men's Fashion", count: 64 },
  { id: "womens", label: "Women's Fashion", count: 72 },
  { id: "accessories", label: "Accessories", count: 20 },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const COLORS = [
  { id: "black", label: "Black", hex: "#000000" },
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "red", label: "Red", hex: "#DC2626" },
  { id: "blue", label: "Blue", hex: "#2563EB" },
  { id: "green", label: "Green", hex: "#059669" },
  { id: "gray", label: "Gray", hex: "#6B7280" },
];

const BRANDS = [
  { id: "nike", label: "Nike", count: 28 },
  { id: "adidas", label: "Adidas", count: 24 },
  { id: "zara", label: "Zara", count: 32 },
  { id: "hm", label: "H&M", count: 26 },
  { id: "uniqlo", label: "Uniqlo", count: 22 },
];



export default function FilterPanel({
  filters,
  productCount,
  isMobileOpen,
  onMobileClose,
  onFilterChange,
}: FilterPanelProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters.priceRange
  );

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    brand: true,
  });


  const toggleSection = (key: keyof typeof expandedSections) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));


  const updateFilter = (key: keyof Filters, value: any) =>
    onFilterChange({ ...filters, [key]: value });

  const handlePriceChange = (index: number, value: string) => {
    const updated = [...priceRange] as [number, number];
    updated[index] = Number(value);

    setPriceRange(updated);
    updateFilter("priceRange", updated);
  };

  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    const arr = filters[key] as string[];
    const updated = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];

    updateFilter(key, updated);
  };


  const handleClearAll = () => {
    const defaultFilters: Filters = {
      category: "all",
      priceRange: [0, 500],
      sizes: [],
      colors: [],
      brands: [],
    };

    setPriceRange([0, 500]);
    onFilterChange(defaultFilters);
  };


  const filterContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-text-primary font-heading">
            Filters
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {productCount} products found
          </p>
        </div>

        <div className="flex items-center space-x-2">
         

          <button
  onClick={handleClearAll}
  className="text-sm cursor-pointer 
  bg-red-500 text-white rounded-md 
  px-4 py-2 shadow-sm
  hover:bg-red-600 active:scale-95 
  transition-all"
>
  Clear All
</button>

          {/* Close button (mobile) */}
          {isMobileOpen && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 hover:bg-muted rounded-md transition-smooth"
            >
              <Icon name="XMarkIcon" size={24} variant="outline" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
       
        <Section
          title="Category"
          expanded={expandedSections.category}
          onToggle={() => toggleSection("category")}
        >
          {CATEGORIES.map((cat) => (
            <LabelRow key={cat.id}>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat.id}
                  onChange={() => updateFilter("category", cat.id)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-400 
  border-gray-300"
                />


                <span className="text-sm">{cat.label}</span>
              </div>
              <span className="text-xs text-text-secondary">({cat.count})</span>
            </LabelRow>
          ))}
        </Section>

   
        <Section
          title="Price Range"
          expanded={expandedSections.price}
          onToggle={() => toggleSection("price")}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <input
                  key={i}
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[i]}
                  onChange={(e) => handlePriceChange(i, e.target.value)}
                  // className="w-full h-2 bg-muted rounded-lg cursor-pointer accent-accent"
                  className="w-full h-2 rounded-lg bg-gray-200 accent-blue-600 cursor-pointer"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">${priceRange[0]}</span>
              <span className="text-text-secondary">to</span>
              <span className="font-medium">${priceRange[1]}</span>
            </div>
          </div>
        </Section>

        <Section
          title="Size"
          expanded={expandedSections.size}
          onToggle={() => toggleSection("size")}
        >
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((size) => {
              const selected = filters.sizes.includes(size);
              return (
                <button
                key={size}
                onClick={() => toggleArrayFilter("sizes", size)}
                className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-md border min-h-touch transition-smooth ${
                  selected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-background text-text-primary border-border hover:bg-blue-100"
                }`}
              >
                {size}
              </button>
              );
            })}
          </div>
        </Section>

   
        <Section
          title="Color"
          expanded={expandedSections.color}
          onToggle={() => toggleSection("color")}
        >
          <div className="grid grid-cols-3 gap-3">
            {COLORS.map((color) => {
              const selected = filters.colors.includes(color.id);
              return (
                <button
  key={color.id}
  onClick={() => toggleArrayFilter("colors", color.id)}
  className={`flex cursor-pointer flex-col items-center space-y-2 p-2 rounded-md min-h-touch transition-smooth 
    ${selected ? "bg-blue-100" : "hover:bg-muted"}`}
>
  <div
    className={`w-8 h-8 rounded-full border 
      ${selected ? "ring-2 ring-blue-500 border-white" : ""}`}
    style={{ backgroundColor: color.hex }}
  />
  <span className={`text-xs ${selected ? "text-blue-600 font-semibold" : ""}`}>
    {color.label}
  </span>
</button>
              );
            })}
          </div>
        </Section>

      
        <Section
          title="Brand"
          expanded={expandedSections.brand}
          onToggle={() => toggleSection("brand")}
        >
          {BRANDS.map((brand) => (
            <LabelRow key={brand.id}>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand.id)}
                  onChange={() => toggleArrayFilter("brands", brand.id)}
                  className="w-4 h-4 text-blue-600 
  focus:ring-blue-400 
  rounded border-gray-300"
                />
             
                <span className="text-sm">{brand.label}</span>
              </div>
              <span className="text-xs text-text-secondary">({brand.count})</span>
            </LabelRow>
          ))}
        </Section>
      </div>
    </>
  );


  return (
    <>

<aside className="hidden lg:block w-80 bg-white border border-gray-200 
rounded-xl overflow-hidden h-fit sticky top-24 shadow-sm">
  {filterContent}
</aside>

    
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[1100] flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
         <div className="relative w-full max-w-sm bg-white 
shadow-xl rounded-l-xl ml-auto flex flex-col h-full animate-slideInRight">
  {filterContent}
</div>
        </div>
      )}
    </>
  );
}



interface SectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, expanded, onToggle, children }: SectionProps) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 
        hover:bg-gray-50 rounded-md transition-all duration-200"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>

        <Icon
          name="ChevronDownIcon"
          size={20}
          variant="outline"
          className={`transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 animate-fadeIn">{children}</div>
      )}
    </div>
  );
}

function LabelRow({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="flex items-center justify-between cursor-pointer 
      hover:bg-gray-50 
      p-2 rounded-md 
      transition-all duration-200 
      text-gray-700"
    >
      {children}
    </label>
  );
}
