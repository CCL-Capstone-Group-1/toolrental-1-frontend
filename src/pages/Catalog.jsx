import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import { useAuth } from "../context/AuthContext";
import { mockListings } from "../data/mockListings";
import FilterDropdown from "../listings/FilterDropdown";
import ListingCarousel from "../listings/ListingCarousel";
import Button from "../components/Button";
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

    // Title is the only identity that's meaningful across the real backend,
    // the local mock store, and this static catalog - a real row's id is
    // assigned independently, so keying on id here could dedupe two
    // unrelated tools together (or fail to dedupe a genuine duplicate)
    // purely by coincidence. When two sources both have an entry for the
    // same title, merge them field-by-field (first non-empty value wins)
    // instead of picking one source wholesale - otherwise whichever source
    // happens to be listed first "wins" even when the other one actually
    // has the field (e.g. category) that this one is missing.
    const byKey = new Map();
    combined.forEach((listing) => {
      const key = listing.title || String(listing.id);
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, listing);
        return;
      }
      const merged = { ...existing };
      Object.entries(listing).forEach(([field, value]) => {
        if (merged[field] === undefined || merged[field] === null || merged[field] === "") {
          merged[field] = value;
        }
      });
      byKey.set(key, merged);
    });

    const mapped = [...byKey.values()].map((listing) => {
      // Match on title only - a real backend row's id is assigned
      // independently of this static catalog's, so two unrelated tools can
      // share an id by pure coincidence (e.g. both "id: 1") and end up
      // wrongly matched, backfilling one tool's photo onto another.
      const matchingMock = mockListings.find((mockListing) => mockListing.title === listing.title);

      const imageUrl =
        listing.imageUrl ||
        listing.image_url ||
        listing.photoUrl ||
        listing.photo_url ||
        listing.image ||
        matchingMock?.imageUrl;

      // rentalCount/seasonal/category are decorative/optional fields that
      // only ever lived on the local mock catalog (or aren't populated by
      // the backend yet). A real backend row that happens to share a title
      // with a mock entry (e.g. a seeded duplicate) would otherwise miss
      // these, emptying out the Most Popular / Seasonal carousels and the
      // category filter.
      const rentalCount =
        typeof listing.rentalCount === "number" ? listing.rentalCount : matchingMock?.rentalCount;
      const seasonal = listing.seasonal ?? matchingMock?.seasonal;
      // The real backend nests category under the related `tools` row
      // (listing.tools.category) rather than on the listing itself.
      const category = listing.category || listing.tools?.category || matchingMock?.category;

      return { ...listing, imageUrl, rentalCount, seasonal, category };
    });

    // Only a listing with no counterpart in the baseline mock catalog is
    // "newly created" (via "List a Tool"). Every real backend row carries
    // its own createdAt/created_at timestamp too, so checking for that
    // field alone would resort the *entire* catalog by DB insert order
    // instead of surfacing just the tools someone actually just added.
    const isBaselineListing = (listing) =>
      mockListings.some((mockListing) => mockListing.title === listing.title);

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
        <Link to="/listings/new" viewTransition>+ List a Tool</Link>
      </div>

      {!user && (
        <div className="catalog__auth-banner">
          <div>
            <h2>Get full access</h2>
            <p>Sign up or sign in to rent tools, message owners, and list your own.</p>
          </div>
          <div className="catalog__auth-banner-actions">
            <Link to="/register" viewTransition>
              <Button type="button">Sign Up</Button>
            </Link>
            <Link to="/login" viewTransition>
              <Button type="button" variant="secondary">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}

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