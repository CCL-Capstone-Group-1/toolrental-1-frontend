import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../services/api";
import "./ListingCard.css";

export default function ListingCard({ listing, isAuthenticated = false, currentUserId = null }) {
  const { id, title, category, pricePerDay, ownerName, rating, rentalCount, ownerId, userId } = listing;
  const imageUrl = resolveImageUrl(
    listing.imageUrl || listing.image_url || listing.photoUrl || listing.photo_url || listing.image
  );
  const navigate = useNavigate();
  const { items, addItem } = useCart();
  const inCart = items.some((item) => item.id === id);

  const isOwnListing =
    currentUserId != null &&
    (String(ownerId) === String(currentUserId) || String(userId) === String(currentUserId));

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addItem({ ...listing, imageUrl });
  };

  return (
    <div className="listing-card">
      <Link to={isAuthenticated ? `/tools/${id}` : "/login"} className="listing-card__link" viewTransition>
        <div className="listing-card__image-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="listing-card__image" />
          ) : (
            <div className="listing-card__image-placeholder">No Image</div>
          )}
        </div>
        <div className="listing-card__body">
          <h3 className="listing-card__title">{title}</h3>
          {category && <span className="listing-card__category">{category}</span>}
          {typeof rating === "number" && (
            <div className="listing-card__rating" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((value) => (
                <span key={value} aria-hidden="true">
                  {value <= Math.round(rating) ? "★" : "☆"}
                </span>
              ))}
              <span className="listing-card__rating-number">{rating.toFixed(1)}</span>
              {typeof rentalCount === "number" && (
                <span className="listing-card__rating-count">({rentalCount})</span>
              )}
            </div>
          )}
          <div className="listing-card__meta">
            <span className="listing-card__price">${pricePerDay}/day</span>
            {ownerName && <span className="listing-card__owner">by {ownerName}</span>}
          </div>
        </div>
      </Link>
      <div className="listing-card__footer">
        {isOwnListing ? (
          <span className="listing-card__own-badge">Your listing</span>
        ) : (
          <button type="button" className="listing-card__add-btn" onClick={handleAddToCart}>
            {inCart ? "Added to Trip" : "Rent This Tool"}
          </button>
        )}
      </div>
    </div>
  );
}