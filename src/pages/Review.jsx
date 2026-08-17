import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";
import Button from "../components/Button";
import "./Review.css";

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addReview, isLoading, error } = useReviews();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState(null);

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
          <span>Leave review for this tool</span>
          <div className="review-card__stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`review-card__star${value <= rating ? " review-card__star--filled" : ""}`}
                onClick={() => setRating(value)}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
              >
                ★
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
