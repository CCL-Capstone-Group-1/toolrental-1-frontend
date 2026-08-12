import { useEffect, useState } from "react";
import "./FilterDropdown.css";

export default function FilterDropdown({ categories = [], onFilterChange }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    onFilterChange?.({ search, category });
  }, [search, category]);

  return (
    <div className="filter-bar">
      <input
        type="search"
        className="filter-bar__search"
        placeholder="Search tools…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search tools"
      />

      <select
        className="filter-bar__select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
