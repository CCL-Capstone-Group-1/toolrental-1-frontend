import { useEffect, useRef } from "react";
import ListingCard from "./ListingCard";
import "./ListingCarousel.css";

export default function ListingCarousel({ title, listings, isAuthenticated = false, currentUserId = null }) {
  const trackRef = useRef(null);
  const scrollByAmount = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  // Some browsers restore a scrollable element's previous scroll offset on
  // reload/back-navigation, same as they do for the page itself. Force each
  // carousel back to its start so it doesn't open mid-scroll from a
  // position left over from an earlier visit. This has to depend on
  // `listings` (not run once on mount) because the track doesn't exist in
  // the DOM at all until listings finish loading — a mount-only effect
  // fires while trackRef is still null and never gets another chance.
  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, [listings]);

  if (!listings || listings.length === 0) return null;
  return (
    <section className="listing-carousel">
      <div className="listing-carousel__header">
        {title ? <h2>{title}</h2> : <span />}
        <div className="listing-carousel__controls">
          <button
            type="button"
            className="listing-carousel__nav"
            aria-label={`Scroll ${title || "listings"} left`}
            onClick={() => scrollByAmount(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="listing-carousel__nav"
            aria-label={`Scroll ${title || "listings"} right`}
            onClick={() => scrollByAmount(1)}
          >
            ›
          </button>
        </div>
      </div>
      <div className="listing-carousel__track" ref={trackRef}>
        {listings.map((listing) => (
          <div className="listing-carousel__item" key={listing.id}>
            <ListingCard listing={listing} isAuthenticated={isAuthenticated} currentUserId={currentUserId} />
          </div>
        ))}
      </div>
    </section>
  );
}