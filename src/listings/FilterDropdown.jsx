import { useState } from "react";
import CustomSelect from "../components/CustomSelect";
import "./FilterDropdown.css";

function CalendarIcon() {
  return (
    <svg
      className="search-filters__date-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <line x1="8" y1="2.5" x2="8" y2="6.5" />
      <line x1="16" y1="2.5" x2="16" y2="6.5" />
    </svg>
  );
}

export default function FilterDropdown({ categories = [], onFilterChange }) {
  const [product, setProduct] = useState("");
  const [availabilityStart, setAvailabilityStart] = useState("");
  const [availabilityEnd, setAvailabilityEnd] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange?.({ search: product, category, availabilityStart, availabilityEnd });
  };

  return (
    <form className="search-filters" onSubmit={handleSubmit}>
      <div className="search-filters__input-wrap">
        <input
          id="filter-product"
          type="search"
          className="search-filters__input"
          placeholder="Search tools…"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
      </div>
      <div className="search-filters__chip-row">
        <CustomSelect
          triggerClassName="search-filters__chip"
          ariaLabel="Filter by category"
          placeholder="All Categories"
          value={category}
          onChange={setCategory}
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />
        <label className="search-filters__chip search-filters__chip--date">
          <span className="search-filters__chip-label">From</span>
          <span className="search-filters__date-wrap">
            <input
              type="date"
              className="search-filters__date-input"
              value={availabilityStart}
              onChange={(e) => setAvailabilityStart(e.target.value)}
            />
            {!availabilityStart && (
              <span className="search-filters__date-placeholder" aria-hidden="true">
                mm/dd/yyyy
              </span>
            )}
            <CalendarIcon />
          </span>
        </label>
        <label className="search-filters__chip search-filters__chip--date">
          <span className="search-filters__chip-label">Until</span>
          <span className="search-filters__date-wrap">
            <input
              type="date"
              className="search-filters__date-input"
              value={availabilityEnd}
              onChange={(e) => setAvailabilityEnd(e.target.value)}
              min={availabilityStart || undefined}
            />
            {!availabilityEnd && (
              <span className="search-filters__date-placeholder" aria-hidden="true">
                mm/dd/yyyy
              </span>
            )}
            <CalendarIcon />
          </span>
        </label>
        <button type="submit" className="search-filters__search-btn">
          Search
        </button>
      </div>
    </form>
  );
}