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
    

<div className="relative">
<select
  id="sort-select"
  value={sortBy}
  onChange={(e) => onSortChange(e.target.value as SortOptionId)}
  className="
    appearance-none 
    px-4 py-2 
    bg-white 
    border border-gray-300 
    rounded-lg 
    text-sm 
    font-medium
    text-gray-700 
    shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-all duration-200 
    pr-10 
    min-h-touch
    hover:border-gray-400
    cursor-pointer
  "
>
  {sortOptions.map((option) => (
    <option key={option.id} value={option.id}>
      {option.label}
    </option>
  ))}
</select>


</div>

  );
}
