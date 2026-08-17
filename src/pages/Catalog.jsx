import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import { useAuth } from "../context/AuthContext";
import { mockListings } from "../data/mockListings";
import FilterDropdown from "../listings/FilterDropdown";
import ListingGrid from "../listings/ListingGrid";
import "./Catalog.css";

const PAGE_SIZE = 8;

export default function Catalog() {
  const { user } = useAuth();
  const { listings, isLoading, error, fetchListings } = useListings();
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // No live backend yet — fall back to local seed data so the catalog isn't
  // empty. Remove once listingService.getAllListings() has a real API to hit.
  const sourceListings = error ? mockListings : listings;

  const categories = useMemo(
    () => [...new Set(sourceListings.map((listing) => listing.category).filter(Boolean))],
    [sourceListings]
  );

  const filteredListings = useMemo(() => {
    return sourceListings.filter((listing) => {
      const matchesSearch = listing.title?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory =
        !categories.includes(filters.category) || listing.category === filters.category;
      return matchesSearch && matchesCategory;
    });
  }, [sourceListings, filters, categories]);

  const initialListings = filteredListings.slice(0, PAGE_SIZE);
  const extraListings = filteredListings.slice(PAGE_SIZE);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setIsExpanded(false);
  };

  return (
    <main className="catalog">
      <div className="catalog__header">
        <h1>Browse Tools</h1>
        <Link to="/listings/new">+ List a Tool</Link>
      </div>

      <FilterDropdown categories={categories} onFilterChange={handleFilterChange} />
      <ListingGrid
        listings={initialListings}
        isLoading={isLoading}
        error={null}
        isAuthenticated={Boolean(user)}
      />

      {extraListings.length > 0 && (
        <>
          <div className={`catalog__extra${isExpanded ? " catalog__extra--open" : ""}`}>
            <ListingGrid
              listings={extraListings}
              isLoading={false}
              error={null}
              isAuthenticated={Boolean(user)}
            />
          </div>

          <div className="catalog__more">
            <button type="button" className="catalog__more-btn" onClick={() => setIsExpanded((v) => !v)}>
              {isExpanded ? "Less ▴" : "More ▾"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
