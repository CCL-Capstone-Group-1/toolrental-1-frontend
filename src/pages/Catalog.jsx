import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import { useAuth } from "../context/AuthContext";
import { mockListings } from "../data/mockListings";
import FilterDropdown from "../listings/FilterDropdown";
import ListingCarousel from "../listings/ListingCarousel";
import "../listings/ListingGrid.css";
import "./Catalog.css";

export default function Catalog() {
  const { user } = useAuth();
  const { listings, fetchListings } = useListings();

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    availabilityStart: "",
    availabilityEnd: "",
  });

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const sourceListings = useMemo(() => {
    const combined = [...(listings || []), ...mockListings];
    const seen = new Set();

    const mapped = combined
      .filter((listing) => {
        const key = String(listing.id ?? listing.title);

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .map((listing, index) => {
        const matchingMock = mockListings.find(
          (mockListing) =>
            mockListing.id === listing.id ||
            mockListing.title === listing.title
        );

        const imageUrl =
          listing.imageUrl ||
          listing.image_url ||
          listing.photoUrl ||
          listing.photo_url ||
          listing.image ||
          matchingMock?.imageUrl ||
          mockListings[index]?.imageUrl;

        // rentalCount/seasonal are decorative fields that only ever lived on
        // the local mock catalog. A real backend row that happens to share
        // an id/title with a mock entry (e.g. a seeded duplicate) would
        // otherwise win the dedup below and silently lose these, emptying
        // out the Most Popular / Seasonal carousels.
        const rentalCount =
          typeof listing.rentalCount === "number" ? listing.rentalCount : matchingMock?.rentalCount;
        const seasonal = listing.seasonal ?? matchingMock?.seasonal;

        return { ...listing, imageUrl, rentalCount, seasonal };
      });

    // Only a listing with no counterpart in the baseline mock catalog is
    // "newly created" (via "List a Tool"). Every real backend row carries
    // its own createdAt/created_at timestamp too, so checking for that
    // field alone would resort the *entire* catalog by DB insert order
    // instead of surfacing just the tools someone actually just added.
    const isBaselineListing = (listing) =>
      mockListings.some(
        (mockListing) => mockListing.id === listing.id || mockListing.title === listing.title
      );

    const newlyCreated = mapped
      .filter((listing) => (listing.createdAt || listing.created_at) && !isBaselineListing(listing))
      .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
    const rest = mapped.filter(
      (listing) => !(listing.createdAt || listing.created_at) || isBaselineListing(listing)
    );

    return [...newlyCreated, ...rest];
  }, [listings]);

  const categories = useMemo(
    () =>
      [
        ...new Set(
          sourceListings.map((listing) => listing.category).filter(Boolean)
        ),
      ],
    [sourceListings]
  );

  const filteredListings = useMemo(() => {
    const wantsAvailable =
      Boolean(filters.availabilityStart) ||
      Boolean(filters.availabilityEnd);

    return sourceListings.filter((listing) => {
      const matchesSearch = listing.title
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchesCategory =
        !filters.category || listing.category === filters.category;

      const matchesAvailability =
        !wantsAvailable || listing.available !== false;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [sourceListings, filters]);

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

      <FilterDropdown
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {filteredListings.length === 0 ? (
        <p className="listing-grid__status">No tools found.</p>
      ) : (
        <ListingCarousel
          title="Main Catalog"
          listings={filteredListings}
          isAuthenticated={Boolean(user)}
          currentUserId={user?.id}
        />
      )}

      <ListingCarousel
        title="Most Popular"
        listings={mostPopularListings}
        isAuthenticated={Boolean(user)}
        currentUserId={user?.id}
      />

      <ListingCarousel
        title="Seasonal"
        listings={seasonalListings}
        isAuthenticated={Boolean(user)}
        currentUserId={user?.id}
      />
    </main>
  );
}