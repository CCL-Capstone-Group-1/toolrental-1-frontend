import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLoans } from "../hooks/useLoans";
import { useEffect } from "react";
import Button from "../components/Button";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem } = useCart();
  const { loans, isLoading, fetchUserLoans } = useLoans();

  useEffect(() => {
    fetchUserLoans();
  }, [fetchUserLoans]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate(`/rental/${items[0].id}`);
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
        ) : loans.length === 0 ? (
          <p className="cart-page__empty">No rental history yet.</p>
        ) : (
          <div className="cart-page__loan-grid">
            {loans.map((loan) => (
              <div key={loan.id} className="cart-page__loan-card">
                <div className="cart-item__thumb">
                  {loan.imageUrl ? <img src={loan.imageUrl} alt={loan.toolName} /> : <span>Tool Picture</span>}
                </div>
                <span className="cart-item__name">{loan.toolName || loan.title || "Tool"}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
