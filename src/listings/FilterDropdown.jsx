import { useState } from "react";
import CustomSelect from "../components/CustomSelect";
import "./FilterDropdown.css";

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
          <input
            type="date"
            className="search-filters__date-input"
            value={availabilityStart}
            onChange={(e) => setAvailabilityStart(e.target.value)}
          />
        </label>
        <label className="search-filters__chip search-filters__chip--date">
          <span className="search-filters__chip-label">Until</span>
          <input
            type="date"
            className="search-filters__date-input"
            value={availabilityEnd}
            onChange={(e) => setAvailabilityEnd(e.target.value)}
            min={availabilityStart || undefined}
          />
        </label>
        <button type="submit" className="search-filters__search-btn">
          Search
        </button>
      </div>
    </form>
  );
}