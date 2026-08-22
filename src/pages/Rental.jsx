import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoans } from "../hooks/useLoans";
import { usePayments } from "../hooks/usePayments";
import { useCart } from "../context/CartContext";
import { listingService } from "../services/listingService";
import { addMockLoan, addMockMessage, getMockLoans } from "../data/mockLoanStore";
import Input from "../components/Input";
import Button from "../components/Button";
import "./Rental.css";

const PAYOUT_METHODS = ["Cash App", "PayPal", "Venmo"];

function imageUrlFor(item) {
  return (
    item?.imageUrl || item?.image_url || item?.photoUrl || item?.photo_url || item?.image || ""
  );
}

export default function Rental() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { requestNewLoan, isLoading: isLoanLoading } = useLoans();
  const { processNewPayment, isLoading: isPaymentLoading } = usePayments();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payMethod, setPayMethod] = useState("card");
  const [card, setCard] = useState({ name: "", number: "", expDate: "", cvv: "" });
  const [billing, setBilling] = useState({ homeAddress: "", aptNumber: "", city: "", state: "" });
  const [saveInfo, setSaveInfo] = useState(false);
  const [formError, setFormError] = useState(null);
  const [completedLoans, setCompletedLoans] = useState(null);
  const [bookingsByItem, setBookingsByItem] = useState({});

  useEffect(() => {
    let isMounted = true;

    Promise.all(
      items.map((item) =>
        listingService
          .getListingBookings(item.id)
          .then((data) => [item.id, Array.isArray(data) ? data : []])
          .catch(() => [
            item.id,
            getMockLoans()
              .filter((loan) => String(loan.toolId) === String(item.id) && loan.status !== "cancelled")
              .map((loan) => ({ start_date: loan.startDate, end_date: loan.endDate })),
          ])
      )
    ).then((results) => {
      if (isMounted) setBookingsByItem(Object.fromEntries(results));
    });

    return () => {
      isMounted = false;
    };
  }, [items]);

  const conflictsByItem = useMemo(() => {
    if (!startDate || !endDate) return {};
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = {};

    items.forEach((item) => {
      const bookings = bookingsByItem[item.id] || [];
      result[item.id] = bookings.some((booking) => {
        const bookedStart = new Date(booking.start_date || booking.startDate);
        const bookedEnd = new Date(booking.end_date || booking.endDate);
        return start < bookedEnd && bookedStart < end;
      });
    });

    return result;
  }, [items, bookingsByItem, startDate, endDate]);

  const hasConflict = Object.values(conflictsByItem).some(Boolean);

  useEffect(() => {
    if (!completedLoans) return;
    const timer = setTimeout(() => {
      navigate("/account", { state: { newLoans: completedLoans } });
    }, 1500);
    return () => clearTimeout(timer);
  }, [completedLoans, navigate]);

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diff = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.ceil(diff) : 0;
  }, [startDate, endDate]);

  const itemSubtotals = useMemo(
    () => items.map((item) => days * (Number(item.pricePerDay) || 0)),
    [items, days]
  );
  const subtotal = useMemo(() => itemSubtotals.reduce((sum, value) => sum + value, 0), [itemSubtotals]);
  const serviceFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + serviceFee;

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!startDate || !endDate || days <= 0) {
      setFormError("Please choose a valid date range.");
      return;
    }

    if (hasConflict) {
      setFormError("One or more tools are already booked for part of your selected dates.");
      return;
    }

    try {
      const newLoans = [];
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        const amount = itemSubtotals[i] + (i === 0 ? serviceFee : 0);
        const loan = await requestNewLoan({ toolId: item.id, startDate, endDate });
        await processNewPayment({
          loanId: loan?.id,
          amount,
          method: payMethod,
          ...(payMethod === "card" ? { card, billing, saveInfo } : {}),
        });
        newLoans.push({ id: loan?.id, toolName: item.title });
      }
      clearCart();
      setCompletedLoans(newLoans);
    } catch (err) {
      setFormError(err.message || "Failed to complete the rental request.");
    }
  };

  // Dev-only helper: fabricates completed loans locally (no backend call)
  // so the Cart/Account history and Chat pages can be clicked through.
  const handleDevSkip = () => {
    if (hasConflict) {
      setFormError("One or more tools are already booked for part of your selected dates.");
      return;
    }

    const today = new Date();
    const inThreeDays = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const newLoans = [];

    items.forEach((item, index) => {
      const loanId = `dev-${Date.now()}-${index}`;
      const loan = {
        id: loanId,
        toolId: item.id,
        toolName: item.title || "Tool",
        ownerName: item.ownerName || "Owner",
        imageUrl: imageUrlFor(item),
        startDate: startDate || today.toISOString().slice(0, 10),
        endDate: endDate || inThreeDays.toISOString().slice(0, 10),
        status: "active",
        totalPrice: itemSubtotals[index] + (index === 0 ? serviceFee : 0) || Number(item.pricePerDay) || 0,
        role: "borrower",
        borrowerId: "dev-1",
      };

      addMockLoan(loan);
      addMockMessage(loanId, {
        id: 1,
        senderId: "owner-1",
        text: `Hi! Thanks for renting the ${loan.toolName}. Let me know if you have any questions!`,
      });

      newLoans.push({ id: loanId, toolName: loan.toolName });
    });

    clearCart();
    setCompletedLoans(newLoans);
  };

  if (completedLoans) {
    return (
      <main className="rental-page">
        <h1>Request sent!</h1>
        <p>
          Your rental request{completedLoans.length > 1 ? "s" : ""} for{" "}
          {completedLoans.map((loan) => loan.toolName).join(", ")} ha
          {completedLoans.length > 1 ? "ve" : "s"} been submitted. Taking you to your account…
        </p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="rental-page">
        <h1>Your cart is empty</h1>
        <p>Add a tool to your cart before checking out.</p>
      </main>
    );
  }

  return (
    <main className="rental-page">
      <h1>
        {items.length === 1 ? `Rent ${items[0].title}` : `Rent ${items.length} Tools`}
      </h1>

      <form className="rental-form" onSubmit={handleSubmit}>
        <div className="rental-section">
          <h2>Rental Dates</h2>
          <div className="rental-row">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="rental-summary">
            <h3>Price Summary</h3>
            {items.map((item, index) => (
              <div className="rental-summary__row" key={item.id}>
                <span>
                  {item.title} ({days} day{days === 1 ? "" : "s"})
                  {conflictsByItem[item.id] && (
                    <span className="rental-summary__conflict">
                      {" "}
                      — already booked for part of these dates
                    </span>
                  )}
                </span>
                <span>${itemSubtotals[index].toFixed(2)}</span>
              </div>
            ))}
            <div className="rental-summary__row">
              <span>Additional Costs</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="rental-summary__row rental-summary__row--total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="rental-section">
          <h2>Payment</h2>

          <div className="rental-terms">
            <div className="rental-terms__card">
              <span className="rental-terms__number">25%</span>
              <span className="rental-terms__label">
                Refundable security deposit (min. $50) held at checkout, returned after an on-time,
                undamaged return.
              </span>
            </div>
            <div className="rental-terms__card">
              <span className="rental-terms__number">1.5×</span>
              <span className="rental-terms__label">
                Daily rate charged for each day a tool is returned late, deducted from your deposit first.
              </span>
            </div>
            <div className="rental-terms__card">
              <span className="rental-terms__number">100%</span>
              <span className="rental-terms__label">
                Full replacement value owed if a tool is lost or stolen while in your care.
              </span>
            </div>
          </div>

          <div className="rental-payment">
            <div className="rental-payment__card">
              <h3>Pay With Card</h3>
              <Input label="Name on card" name="name" value={card.name} onChange={handleCardChange} />
              <Input label="Card Number" name="number" value={card.number} onChange={handleCardChange} />
              <div className="rental-row">
                <Input label="Exp Date" name="expDate" value={card.expDate} onChange={handleCardChange} />
                <Input label="CVV" name="cvv" value={card.cvv} onChange={handleCardChange} />
              </div>
            </div>

            <div className="rental-payment__alt">
              <h3>Or pay with:</h3>
              {PAYOUT_METHODS.map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant="primary"
                  className={payMethod === method ? "rental-payment__alt-btn--active" : ""}
                  onClick={() => setPayMethod(method)}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          <label className="rental-save">
            <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
            Save payment information
          </label>
        </div>

        <div className="rental-section">
          <h2>Billing Address</h2>
          <Input
            label="Home Address"
            name="homeAddress"
            value={billing.homeAddress}
            onChange={handleBillingChange}
          />
          <Input
            label="Apt #, P.O. Box, etc."
            name="aptNumber"
            value={billing.aptNumber}
            onChange={handleBillingChange}
          />
          <div className="rental-row">
            <Input label="City" name="city" value={billing.city} onChange={handleBillingChange} />
            <Input label="State" name="state" value={billing.state} onChange={handleBillingChange} />
          </div>
        </div>

        {formError && <p className="rental-page__error">{formError}</p>}

        <div className="rental-page__actions">
          <Button type="button" variant="secondary" onClick={handleDevSkip} disabled={hasConflict}>
            Skip Payment (Dev)
          </Button>
          <Button type="submit" disabled={isLoanLoading || isPaymentLoading || hasConflict}>
            {isLoanLoading || isPaymentLoading ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </form>
    </main>
  );
}
