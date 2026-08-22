import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import { useAuth } from "../context/AuthContext";
import { mockListings } from "../data/mockListings";
import { resolveImageUrl } from "../services/api";
import FilterDropdown from "../listings/FilterDropdown";
import ListingCarousel from "../listings/ListingCarousel";
import "../listings/ListingGrid.css";
import "./Catalog.css";

export default function Catalog() {
  const { user } = useAuth();
  const { listings, isLoading, error, fetchListings } = useListings();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    availabilityStart: "",
    availabilityEnd: "",
  });

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // No live backend yet — fall back to local seed data so the catalog isn't
  // empty. Remove once listingService.getAllListings() has a real API to hit.
  const sourceListings = error
    ? mockListings
    : listings.map((listing, index) => {
        const matchingMock = mockListings.find(
          (mockListing) => mockListing.id === listing.id || mockListing.title === listing.title
        );
        const imageUrl = resolveImageUrl(
          listing.imageUrl ||
            listing.image_url ||
            listing.photoUrl ||
            listing.photo_url ||
            listing.image
        ) ||
          matchingMock?.imageUrl ||
          mockListings[index]?.imageUrl;

        return { ...listing, imageUrl };
      });

  const categories = useMemo(
    () => [...new Set(sourceListings.map((listing) => listing.category).filter(Boolean))],
    [sourceListings]
  );

  const filteredListings = useMemo(() => {
    // There's no per-date booking data yet, so the availability filter is a
    // stand-in: requesting a date range just narrows to listings marked
    // available. Replace once real date-based availability exists on the
    // backend.
    const wantsAvailable = Boolean(filters.availabilityStart) || Boolean(filters.availabilityEnd);

    return sourceListings.filter((listing) => {
      const matchesSearch = listing.title?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory =
        !categories.includes(filters.category) || listing.category === filters.category;
      const matchesAvailability = !wantsAvailable || listing.available !== false;
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [sourceListings, filters, categories]);

  // rentalCount/seasonal are placeholder fields from mock data — see
  // src/data/mockListings.js. Swap for real backend-derived data once
  // it exists.
  const mostPopularListings = useMemo(
    () =>
      [...sourceListings]
        .filter((listing) => typeof listing.rentalCount === "number")
        .sort((a, b) => b.rentalCount - a.rentalCount)
        .slice(0, 8),
    [sourceListings]
  );

  const seasonalListings = useMemo(
    () => sourceListings.filter((listing) => listing.seasonal),
    [sourceListings]
  );

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
  };

  return (
    <main className="catalog">
      <div className="catalog__header">
        <h1>Browse Tools</h1>
        <Link to="/listings/new">+ List a Tool</Link>
      </div>

      <FilterDropdown categories={categories} onFilterChange={handleFilterChange} />

      {isLoading ? (
        <p className="listing-grid__status">Loading tools…</p>
      ) : filteredListings.length === 0 ? (
        <p className="listing-grid__status">No tools found.</p>
      ) : (
        <ListingCarousel
          title="Main Catalog"
          listings={filteredListings}
          isAuthenticated={Boolean(user)}
        />
      )}

      <ListingCarousel
        title="Most Popular"
        listings={mostPopularListings}
        isAuthenticated={Boolean(user)}
      />
      <ListingCarousel
        title="Seasonal"
        listings={seasonalListings}
        isAuthenticated={Boolean(user)}
      />
    </main>
  );
}