"use client";

import Icon from "@/componnets/ui/appIcon";

export type SortOptionId =
  | "relevance"
  | "price-low"
  | "price-high"
  | "newest"
  | "rating";

interface SortControlsProps {
  sortBy: SortOptionId;
  onSortChange: (value: SortOptionId) => void;
  onFilterToggle: () => void;
}

export default function SortControls({
  sortBy,
  onSortChange,
  onFilterToggle,
}: SortControlsProps) {
  const sortOptions: { id: SortOptionId; label: string }[] = [
    { id: "relevance", label: "Relevance" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "newest", label: "Newest Arrivals" },
    { id: "rating", label: "Customer Rating" },
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
      {/* Mobile Filters Button */}
      <button
        onClick={onFilterToggle}
        className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-smooth min-h-touch"
      >
        <Icon name="AdjustmentsHorizontalIcon" size={20} variant="outline" />
        <span>Filters</span>
      </button>

      {/* Sorting Dropdown */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="sort-select"
          className="text-sm font-medium text-text-primary"
        >
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOptionId)}
          className="px-4 py-2 bg-background border border-input rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth min-h-touch"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
