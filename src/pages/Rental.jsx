import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listingService } from "../services/listingService";
import { useLoans } from "../hooks/useLoans";
import { usePayments } from "../hooks/usePayments";
import { mockListings } from "../data/mockListings";
import { addMockLoan, addMockMessage } from "../data/mockLoanStore";
import Input from "../components/Input";
import Button from "../components/Button";
import "./Rental.css";

const PAYOUT_METHODS = ["Cash App", "PayPal", "Venmo"];

export default function Rental() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const { requestNewLoan, isLoading: isLoanLoading } = useLoans();
  const { processNewPayment, isLoading: isPaymentLoading } = usePayments();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payMethod, setPayMethod] = useState("card");
  const [card, setCard] = useState({ name: "", number: "", expDate: "", cvv: "" });
  const [billing, setBilling] = useState({ homeAddress: "", aptNumber: "", city: "", state: "" });
  const [saveInfo, setSaveInfo] = useState(false);
  const [formError, setFormError] = useState(null);
  const [completedLoan, setCompletedLoan] = useState(null);

  useEffect(() => {
    listingService
      .getListingById(id)
      .then(setListing)
      .catch(() => setListing(mockListings.find((item) => String(item.id) === String(id)) || null));
  }, [id]);

  useEffect(() => {
    if (!completedLoan) return;
    const timer = setTimeout(() => {
      navigate("/account", {
        state: { newLoanId: completedLoan.id, toolName: completedLoan.toolName },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [completedLoan, navigate]);

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diff = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.ceil(diff) : 0;
  }, [startDate, endDate]);

  const pricePerDay = Number(listing?.pricePerDay) || 0;
  const subtotal = days * pricePerDay;
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

    try {
      const loan = await requestNewLoan({ toolId: id, startDate, endDate });
      await processNewPayment({
        loanId: loan?.id,
        amount: total,
        method: payMethod,
        ...(payMethod === "card" ? { card, billing, saveInfo } : {}),
      });
      setCompletedLoan({ id: loan?.id, toolName: listing?.title });
    } catch (err) {
      setFormError(err.message || "Failed to complete the rental request.");
    }
  };

  // Dev-only helper: fabricates a completed loan locally (no backend call)
  // so the Cart/Account history and Chat pages can be clicked through.
  const handleDevSkip = () => {
    const today = new Date();
    const inThreeDays = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const loanId = `dev-${Date.now()}`;

    const loan = {
      id: loanId,
      toolId: id,
      toolName: listing?.title || "Tool",
      ownerName: listing?.ownerName || "Owner",
      imageUrl: listing?.imageUrl || "",
      startDate: startDate || today.toISOString().slice(0, 10),
      endDate: endDate || inThreeDays.toISOString().slice(0, 10),
      status: "active",
      totalPrice: total || Number(listing?.pricePerDay) || 0,
      role: "borrower",
      borrowerId: "dev-1",
    };

    addMockLoan(loan);
    addMockMessage(loanId, {
      id: 1,
      senderId: "owner-1",
      text: `Hi! Thanks for renting the ${loan.toolName}. Let me know if you have any questions!`,
    });

    setCompletedLoan({ id: loanId, toolName: loan.toolName });
  };

  if (completedLoan) {
    return (
      <main className="rental-page">
        <h1>Request sent!</h1>
        <p>Your rental request has been submitted. Taking you to your account…</p>
      </main>
    );
  }

  return (
    <main className="rental-page">
      <h1>{listing ? `Rent ${listing.title}` : "Rent this tool"}</h1>

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
            <div className="rental-summary__row">
              <span>Price Calculation ({days} day{days === 1 ? "" : "s"})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
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
          <Button type="button" variant="secondary" onClick={handleDevSkip}>
            Skip Payment (Dev)
          </Button>
          <Button type="submit" disabled={isLoanLoading || isPaymentLoading}>
            {isLoanLoading || isPaymentLoading ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </form>
    </main>
  );
}
