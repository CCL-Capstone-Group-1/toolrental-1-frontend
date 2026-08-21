import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";
import { listingService } from "../services/listingService";
import { mockListings } from "../data/mockListings";
import Button from "../components/Button";
import "./Review.css";

function initialsFor(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addReview, isLoading, error } = useReviews();
  const [listing, setListing] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    listingService
      .getListingById(id)
      .then(setListing)
      .catch(() => setListing(mockListings.find((item) => String(item.id) === String(id)) || null));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (rating === 0) {
      setFormError("Please choose a star rating.");
      return;
    }

    try {
      await addReview({ toolId: id, rating, comment });
      navigate(`/tools/${id}`);
    } catch (err) {
      setFormError(err.message || "Failed to submit your review.");
    }
  };

  return (
    <main className="review-page">
      <h1>Let us know about your experience</h1>

      <form className="review-card" onSubmit={handleSubmit}>
        <div className="review-card__head">
          <span className="review-card__owner">
            Leave review for
            <span className="review-card__avatar">{initialsFor(listing?.ownerName)}</span>
            <span className="review-card__owner-name">{listing?.ownerName || "the owner"}</span>
          </span>
          <div className="review-card__stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`review-card__star${value <= rating ? " review-card__star--filled" : ""}`}
                onClick={() => setRating(value)}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
              >
                {value <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="review-card__textarea"
          placeholder="Share details about your experience…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={6}
        />

        {(formError || error) && <p className="review-page__error">{formError || error}</p>}

        <div className="review-page__actions">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </form>
    </main>
  );
}
