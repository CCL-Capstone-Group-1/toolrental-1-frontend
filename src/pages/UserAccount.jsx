import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLoans } from "../hooks/useLoans";
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

function LoanGrid({ loans, emptyMessage }) {
  if (loans.length === 0) {
    return <p className="account-page__empty">{emptyMessage}</p>;
  }

  return (
    <div className="account-page__loan-grid">
      {loans.map((loan) => (
        <div key={loan.id} className="account-page__loan-card">
          <div className="account-page__loan-thumb">
            {loan.imageUrl ? <img src={loan.imageUrl} alt={loan.toolName} /> : <span>Tool Picture</span>}
          </div>
          <span className="account-page__loan-name">{loan.toolName || loan.title || "Tool"}</span>
          {loan.ownerName && <span className="account-page__loan-owner">{loan.ownerName}</span>}
        </div>
      ))}
    </div>
  );
}

export default function UserAccount() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { loans, isLoading, fetchUserLoans } = useLoans();

  useEffect(() => {
    fetchUserLoans();
  }, [fetchUserLoans]);

  if (isAuthLoading) {
    return <p className="account-page__empty">Loading account…</p>;
  }

  if (!user) {
    return <p className="account-page__empty">No authenticated user found.</p>;
  }

  const rented = loans.filter((loan) => loan.borrowerId === user.id || loan.role === "borrower");
  const lentOut = loans.filter((loan) => loan.ownerId === user.id || loan.role === "owner");

  return (
    <main className="account-page">
      <div className="account-page__header">
        <span className="account-page__avatar">{initialsFor(user.name || user.email)}</span>
        <div>
          <h1>{user.name || user.email}</h1>
          {user.homeAddress && <p className="account-page__address">{user.homeAddress}</p>}
        </div>
      </div>

      <section className="account-page__section">
        <h2>Previous Tools Rented</h2>
        {isLoading ? (
          <p className="account-page__empty">Loading…</p>
        ) : (
          <LoanGrid loans={rented} emptyMessage="You haven't rented any tools yet." />
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
    </main>
  );
}
