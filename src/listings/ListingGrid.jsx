import ListingCard from "./ListingCard";
import "./ListingGrid.css";

export default function ListingGrid({ listings, isLoading, error, emptyMessage = "No tools found." }) {
  if (isLoading) {
    return <p className="listing-grid__status">Loading tools…</p>;
  }

  if (error) {
    return <p className="listing-grid__status listing-grid__status--error">{error}</p>;
  }

  if (!listings || listings.length === 0) {
    return <p className="listing-grid__status">{emptyMessage}</p>;
  }

  return (
    <div className="listing-grid">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
