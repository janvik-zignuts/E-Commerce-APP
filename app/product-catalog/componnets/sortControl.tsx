"use client";

import { sortOptions } from "../constant";
import { SortControlsProps, SortOptionId } from "../interface";

const  SortControls=({
  sortBy,
  onSortChange,
}: SortControlsProps) =>{
 

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


export default SortControls;