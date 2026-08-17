import { useState } from "react";
import "./FilterDropdown.css";

const EXTRA_SORT_OPTIONS = ["Most Popular", "Seasonal"];

export default function FilterDropdown({ categories = [], onFilterChange }) {
  const [product, setProduct] = useState("");
  const [availability, setAvailability] = useState("");
  const [category, setCategory] = useState("");
  const [availabilityOption, setAvailabilityOption] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange?.({ search: product, category });
  };

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <div className="filter-bar__row">
        <label className="filter-bar__label" htmlFor="filter-product">
          Product
        </label>
        <div className="filter-bar__field-group">
          <input
            id="filter-product"
            type="search"
            className="filter-bar__input"
            placeholder="Search tools…"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
          <span className="filter-bar__select-wrap">
            <select
              className="filter-bar__select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="" disabled hidden>
                Categories
              </option>
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              {EXTRA_SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>

      <div className="filter-bar__row">
        <label className="filter-bar__label" htmlFor="filter-availability">
          Availability
        </label>
        <div className="filter-bar__field-group">
          <input
            id="filter-availability"
            type="date"
            className="filter-bar__input"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <span className="filter-bar__select-wrap">
            <select
              className="filter-bar__select"
              value={availabilityOption}
              onChange={(e) => setAvailabilityOption(e.target.value)}
              aria-label="Availability options"
            >
              <option value="" disabled hidden>
                Categories
              </option>
              <option value="Flexible Rates and Dates">Flexible Rates and Dates</option>
            </select>
          </span>
        </div>
      </div>

      <div className="filter-bar__actions">
        <button type="submit" className="filter-bar__search-btn">
          Search
        </button>
      </div>
    </form>
  );
}
