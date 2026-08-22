import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLoans } from "../hooks/useLoans";
import { useEffect } from "react";
import { getMockLoans } from "../data/mockLoanStore";
import Button from "../components/Button";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem } = useCart();
  const { loans, isLoading, error, fetchUserLoans } = useLoans();

  useEffect(() => {
    fetchUserLoans();
  }, [fetchUserLoans]);

  // No live backend yet — fall back to locally-stored dev loans (created via
  // the "Skip Payment (Dev)" button on the Rental page) so history isn't
  // empty. Remove once loanService.getUserLoans() has a real API to hit.
  const sourceLoans = error ? getMockLoans() : loans;

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate("/rental");
  };

  return (
    <main className="cart-page">
      <h1>Cart</h1>

      <div className="cart-box">
        {items.length === 0 ? (
          <p className="cart-page__empty">Your cart is empty. Browse the catalog to add a tool.</p>
        ) : (
          <ul className="cart-items">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <Link to={`/tools/${item.id}`} className="cart-item__link">
                  <div className="cart-item__thumb">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} />
                    ) : (
                      <span>Tool Picture</span>
                    )}
                  </div>
                  <div className="cart-item__info">
                    <span className="cart-item__name">{item.title}</span>
                    {item.ownerName && <span className="cart-item__owner">{item.ownerName}</span>}
                  </div>
                </Link>
                <button type="button" className="cart-item__delete" onClick={() => removeItem(item.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-box__actions">
          <Button type="button" disabled={items.length === 0} onClick={handleCheckout}>
            Check Out
          </Button>
        </div>
      </div>

      <section className="cart-page__loans">
        <h2>Previous Tools Rented</h2>
        {isLoading ? (
          <p className="cart-page__empty">Loading…</p>
        ) : sourceLoans.length === 0 ? (
          <p className="cart-page__empty">No rental history yet.</p>
        ) : (
          <div className="cart-page__loan-grid">
            {sourceLoans.map((loan) => {
              const toolId = loan.toolId || loan.listingId;
              const cardContent = (
                <>
                  <div className="cart-item__thumb">
                    {loan.imageUrl ? <img src={loan.imageUrl} alt={loan.toolName} /> : <span>Tool Picture</span>}
                  </div>
                  <span className="cart-item__name">{loan.toolName || loan.title || "Tool"}</span>
                  {loan.ownerName && <span className="cart-item__owner">{loan.ownerName}</span>}
                </>
              );

              return (
                <div key={loan.id} className="cart-page__loan-card">
                  {toolId ? (
                    <Link to={`/tools/${toolId}`} className="cart-page__loan-card-link">
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
