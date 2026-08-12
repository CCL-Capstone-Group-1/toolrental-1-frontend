import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import FilterDropdown from "../listings/FilterDropdown";
import ListingGrid from "../listings/ListingGrid";
import "./Home.css";

export default function Home() {
  const { listings, isLoading, error, fetchListings } = useListings();
  const [filters, setFilters] = useState({ search: "", category: "" });

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const categories = useMemo(
    () => [...new Set(listings.map((listing) => listing.category).filter(Boolean))],
    [listings]
  );

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch = listing.title?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || listing.category === filters.category;
      return matchesSearch && matchesCategory;
    });
  }, [listings, filters]);

  return (
    <main className="home">
      <div className="home__header">
        <h1>Browse Tools</h1>
        <Link to="/listings/new">+ List a Tool</Link>
      </div>

      <FilterDropdown categories={categories} onFilterChange={setFilters} />
      <ListingGrid listings={filteredListings} isLoading={isLoading} error={error} />
    </main>
  );
}
