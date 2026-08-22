import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoans } from "../hooks/useLoans";
import { getMockLoans } from "../data/mockLoanStore";
import Modal from "../components/Modal";
import ChatBox from "../components/ChatBox";
import "./UserAccount.css";

function initialsFor(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function LoanGrid({ loans, emptyMessage, onOpenChat }) {
  if (loans.length === 0) {
    return <p className="account-page__empty">{emptyMessage}</p>;
  }

  return (
    <div className="account-page__loan-grid">
      {loans.map((loan) => {
        const toolId = loan.toolId || loan.listingId;
        const cardContent = (
          <div className="account-page__loan-card-content">
            <div className="account-page__loan-thumb">
              {loan.imageUrl ? <img src={loan.imageUrl} alt={loan.toolName} /> : <span>Tool Picture</span>}
            </div>
            <span className="account-page__loan-name">{loan.toolName || loan.title || "Tool"}</span>
            {loan.ownerName && <span className="account-page__loan-owner">{loan.ownerName}</span>}
          </div>
        );

        return (
          <div key={loan.id} className="account-page__loan-card">
            {toolId ? (
              <Link to={`/tools/${toolId}`} className="account-page__loan-card-link">
                {cardContent}
              </Link>
            ) : (
              cardContent
            )}
            {onOpenChat && (
              <button
                type="button"
                className="account-page__loan-chat-btn"
                onClick={() => onOpenChat(loan)}
              >
                Chat
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function UserAccount() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { loans, isLoading, error, fetchUserLoans } = useLoans();
  const [activeChatLoan, setActiveChatLoan] = useState(null);
  const location = useLocation();
  const newLoans = location.state?.newLoans?.length ? location.state.newLoans : null;

  useEffect(() => {
    fetchUserLoans();
  }, [fetchUserLoans]);

  if (isAuthLoading) {
    return <p className="account-page__empty">Loading account…</p>;
  }

  if (!user) {
    return <p className="account-page__empty">No authenticated user found.</p>;
  }

  // No live backend yet — fall back to locally-stored dev loans (created via
  // the "Skip Payment (Dev)" button on the Rental page) so history isn't
  // empty. Remove once loanService.getUserLoans() has a real API to hit.
  const sourceLoans = error ? getMockLoans() : loans;

  const rented = sourceLoans.filter((loan) => loan.borrowerId === user.id || loan.role === "borrower");
  const lentOut = sourceLoans.filter((loan) => loan.ownerId === user.id || loan.role === "owner");

  return (
    <main className="account-page">
      <div className="account-page__header">
        <span className="account-page__avatar">{initialsFor(user.name || user.email)}</span>
        <div>
          <h1>{user.name || user.email}</h1>
          {user.homeAddress && <p className="account-page__address">{user.homeAddress}</p>}
        </div>
      </div>

      {newLoans && (
        <div className="account-page__chat-highlight">
          <div>
            <h2>You're all set!</h2>
            <p>
              Your request{newLoans.length > 1 ? "s" : ""} for{" "}
              {newLoans.map((loan) => loan.toolName || "this tool").join(", ")} {newLoans.length > 1 ? "were" : "was"} sent.
              Say hello to the owner{newLoans.length > 1 ? "s" : ""}.
            </p>
          </div>
          <div className="account-page__chat-highlight-actions">
            {newLoans.map((loan) => (
              <button
                key={loan.id}
                type="button"
                className="account-page__chat-highlight-btn"
                onClick={() => setActiveChatLoan(loan)}
              >
                Chat about {loan.toolName || "this tool"}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="account-page__section">
        <h2>Previous Tools Rented</h2>
        {isLoading ? (
          <p className="account-page__empty">Loading…</p>
        ) : (
          <LoanGrid
            loans={rented}
            emptyMessage="You haven't rented any tools yet."
            onOpenChat={setActiveChatLoan}
          />
        )}
      </section>

      <section className="account-page__section">
        <h2>Tools You Have Lent Out</h2>
        {isLoading ? (
          <p className="account-page__empty">Loading…</p>
        ) : (
          <LoanGrid loans={lentOut} emptyMessage="You haven't lent out any tools yet." />
        )}
      </section>

      <Modal
        isOpen={Boolean(activeChatLoan)}
        onClose={() => setActiveChatLoan(null)}
        title={activeChatLoan ? `Chat about ${activeChatLoan.toolName || "this tool"}` : ""}
        className="modal--chat"
      >
        {activeChatLoan && <ChatBox loanId={activeChatLoan.id} />}
      </Modal>
    </main>
  );
}
