import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listingService } from "../services/listingService";
import { resolveImageUrl } from "../services/api";
import { useReviews } from "../hooks/useReviews";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { mockListings } from "../data/mockListings";
import { isOwnListing } from "../utils/listingOwnership";
import Button from "../components/Button";
import "./ToolDetails.css";

export default function ToolDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { reviews, fetchReviewsByTool } = useReviews();
  const { items, addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    listingService
      .getListingById(id)
      .then((data) => {
        if (isMounted) setListing(data);
      })
      .catch(() => {
        // No live backend yet — fall back to local seed data so the tool
        // details page isn't stuck on an error. Remove once
        // listingService.getListingById() has a real API to hit.
        if (isMounted) {
          setListing(mockListings.find((item) => String(item.id) === String(id)) || null);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    fetchReviewsByTool(id);

    return () => {
      isMounted = false;
    };
  }, [id, fetchReviewsByTool]);

  if (isLoading) return <p className="tool-details__status">Loading…</p>;
  if (!listing) return <p className="tool-details__status">Tool not found.</p>;

  const imageUrl = resolveImageUrl(
    listing.imageUrl || listing.image_url || listing.photoUrl || listing.photo_url || listing.image
  );
  const inCart = items.some((item) => item.id === listing.id);
  const isOwn = isOwnListing(listing, user);

  return (
    <main className="tool-details">
      <div className="tool-details__card">
        <div className="tool-details__image-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={listing.title} />
          ) : (
            <span>Tool Picture</span>
          )}
        </div>

        <div className="tool-details__info">
          <h1>{listing.title}</h1>
          {listing.category && <p className="tool-details__category">{listing.category}</p>}
          <p className="tool-details__price">${listing.pricePerDay}/day</p>
          {listing.ownerName && <p className="tool-details__owner">Owner: {listing.ownerName}</p>}
          {listing.description && <p className="tool-details__description">{listing.description}</p>}
        </div>

        <div className="tool-details__actions">
          {isOwn ? (
            <span className="tool-details__own-label">This is your listing</span>
          ) : (
            <Button type="button" onClick={() => addItem({ ...listing, imageUrl })}>
              {inCart ? "In Cart" : "Add To Cart"}
            </Button>
          )}
        </div>
      </div>

      <aside className="tool-details__reviews">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p className="tool-details__status">No reviews yet.</p>
        ) : (
          <ul className="tool-details__review-list">
            {reviews.map((review) => (
              <li key={review.id} className="tool-details__review">
                <div className="tool-details__review-head">
                  <span>{review.reviewerName || "Reviewer"}</span>
                  <span>{"★".repeat(review.rating || 0)}</span>
                </div>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
        <Link to={`/review/${listing.id}`} className="tool-details__leave-review">
          <Button type="button" variant="primary">
            Leave a review
          </Button>
        </Link>
      </aside>
    </main>
  );
}
