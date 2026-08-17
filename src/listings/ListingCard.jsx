import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ListingCard.css";

export default function ListingCard({ listing, isAuthenticated = false }) {
  const { id, title, imageUrl, category, pricePerDay, ownerName } = listing;
  const navigate = useNavigate();
  const { items, addItem } = useCart();
  const inCart = items.some((item) => item.id === id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addItem(listing);
  };

  return (
    <div className="listing-card">
      <Link to={isAuthenticated ? `/tools/${id}` : "/login"} className="listing-card__link">
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
          <div className="listing-card__meta">
            <span className="listing-card__price">${pricePerDay}/day</span>
            {ownerName && <span className="listing-card__owner">by {ownerName}</span>}
          </div>
        </div>
      </Link>

      <div className="listing-card__footer">
        <button type="button" className="listing-card__add-btn" onClick={handleAddToCart}>
          {inCart ? "In Cart" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}
