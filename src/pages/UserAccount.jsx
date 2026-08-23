import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoans } from "../hooks/useLoans";
import { useListings } from "../hooks/useListings";
import { getMockLoans } from "../data/mockLoanStore";
import Modal from "../components/Modal";
import ChatBox from "../components/ChatBox";
import Input from "../components/Input";
import Button from "../components/Button";
import ImageUpload from "../components/ImageUpload";
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

function LoanGrid({ loans, emptyMessage, emptyCta, onOpenChat }) {
  if (loans.length === 0) {
    return (
      <p className="account-page__empty">
        {emptyMessage}
        {emptyCta && (
          <>
            {" "}
            <Link to={emptyCta.to} className="account-page__empty-link" viewTransition>
              {emptyCta.label}
            </Link>
          </>
        )}
      </p>
    );
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
              <Link to={`/tools/${toolId}`} className="account-page__loan-card-link" viewTransition>
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

function ListingGrid({ listings, emptyMessage, emptyCta, onToggleActive }) {
  if (listings.length === 0) {
    return (
      <p className="account-page__empty">
        {emptyMessage}
        {emptyCta && (
          <>
            {" "}
            <Link to={emptyCta.to} className="account-page__empty-link" viewTransition>
              {emptyCta.label}
            </Link>
          </>
        )}
      </p>
    );
  }

  return (
    <div className="account-page__loan-grid">
      {listings.map((listing) => (
        <div key={listing.id} className="account-page__loan-card">
          <Link to={`/tools/${listing.id}`} className="account-page__loan-card-link" viewTransition>
            <div className="account-page__loan-card-content">
              <div className="account-page__loan-thumb">
                {listing.imageUrl ? (
                  <img src={listing.imageUrl} alt={listing.title} />
                ) : (
                  <span>Tool Picture</span>
                )}
              </div>
              <span className="account-page__loan-name">{listing.title}</span>
              <span className="account-page__loan-owner">${listing.pricePerDay}/day</span>
            </div>
          </Link>
          <div className="account-page__listing-actions">
            <Link to={`/listings/${listing.id}/edit`} className="account-page__listing-edit-btn" viewTransition>
              Edit
            </Link>
            <button
              type="button"
              className="account-page__listing-toggle-btn"
              onClick={() => onToggleActive(listing)}
            >
              {listing.isActive === false ? "Reactivate" : "Deactivate"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UserAccount() {
  const { user, isLoading: isAuthLoading, updateUser } = useAuth();
  const { loans, isLoading, error, fetchUserLoans } = useLoans();
  const {
    listings,
    isLoading: isListingsLoading,
    fetchListings,
    updateListing,
  } = useListings();

  const [activeChatLoan, setActiveChatLoan] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    firstName: "",
    lastName: "",
    homeAddress: "",
    city: "",
    state: "",
  });
  const [editPhotoUrl, setEditPhotoUrl] = useState(null);
  const [editError, setEditError] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isReportExpanded, setIsReportExpanded] = useState(false);

  const location = useLocation();
  const newLoans = location.state?.newLoans?.length ? location.state.newLoans : null;

  useEffect(() => {
    fetchUserLoans();
  }, [fetchUserLoans]);

  useEffect(() => {
    if (fetchListings) fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    if (user) {
      setEditValues({
        firstName: user.firstName || user.name?.split(" ")[0] || "",
        lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        homeAddress: user.homeAddress || "",
        city: user.city || "",
        state: user.state || "",
      });
      setEditPhotoUrl(user.avatarUrl || null);
    }
  }, [user]);

  if (isAuthLoading) {
    return <p className="account-page__empty">Loading account…</p>;
  }

  if (!user) {
    return <p className="account-page__empty">No authenticated user found.</p>;
  }

  const sourceLoans = error ? getMockLoans() : loans;
  const rented = sourceLoans.filter((loan) => loan.borrowerId === user.id || loan.role === "borrower");
  const lentOut = sourceLoans.filter((loan) => loan.ownerId === user.id || loan.role === "owner");

  const myListings = (listings || []).filter(
    (listing) => listing.ownerId === user.id || listing.userId === user.id
  );

  const activeRentalsCount = lentOut.filter((loan) => !loan.returnedAt).length;
  const totalEarned = lentOut.reduce(
    (sum, loan) => sum + (Number(loan.totalPrice) || Number(loan.price) || 0),
    0
  );

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);
    setIsSavingEdit(true);
    try {
      await updateUser({
        firstName: editValues.firstName,
        lastName: editValues.lastName,
        name: `${editValues.firstName} ${editValues.lastName}`.trim(),
        homeAddress: editValues.homeAddress,
        city: editValues.city,
        state: editValues.state,
        avatarUrl: editPhotoUrl,
      });
      setIsEditOpen(false);
    } catch (err) {
      setEditError(err.message || "Unable to save changes.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleToggleListingActive = async (listing) => {
    if (!updateListing) return;
    try {
      await updateListing(listing.id, { isActive: listing.isActive === false });
      fetchListings?.();
    } catch (err) {
      console.error("Failed to toggle listing:", err);
    }
  };

  return (
    <main className="account-page">
      <div className="account-page__header">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name || "Profile"} className="account-page__avatar-photo" />
        ) : (
          <span className="account-page__avatar">{initialsFor(user.name || user.email)}</span>
        )}
        <div>
          <h1>{user.name || user.email}</h1>
          {user.homeAddress && <p className="account-page__address">{user.homeAddress}</p>}
        </div>
        <div className="account-page__header-actions">
          <button
            type="button"
            className="account-page__edit-btn"
            onClick={() => setIsEditOpen(true)}
          >
            Edit Profile
          </button>
          <Link to="/listings/new" className="account-page__list-tool-btn" viewTransition>
            + List a Tool
          </Link>
        </div>
      </div>

      <div className="account-page__stats">
        <div className="account-page__stat">
          <span className="account-page__stat-number">{myListings.length}</span>
          <span className="account-page__stat-label">tools listed</span>
        </div>
        <div className="account-page__stat">
          <span className="account-page__stat-number">{activeRentalsCount}</span>
          <span className="account-page__stat-label">active rentals</span>
        </div>
        <div className="account-page__stat">
          <span className="account-page__stat-number">${totalEarned.toFixed(0)}</span>
          <span className="account-page__stat-label">earned</span>
          <button
            type="button"
            className="account-page__stat-report-link"
            onClick={() => setIsReportExpanded((prev) => !prev)}
          >
            {isReportExpanded ? "Hide report" : "View report"}
          </button>
        </div>
      </div>

      {isReportExpanded && (
        <div className="earnings-report earnings-report--inline">
          {lentOut.length === 0 ? (
            <p className="account-page__empty">
              You haven't earned anything yet.{" "}
              <Link to="/listings/new" className="account-page__empty-link" viewTransition>
                List your first tool →
              </Link>
            </p>
          ) : (
            <>
              <div className="earnings-report__list">
                {lentOut.map((loan) => (
                  <div key={loan.id} className="earnings-report__row">
                    <span className="earnings-report__row-name">{loan.toolName || loan.title || "Tool"}</span>
                    <span className="earnings-report__row-status">
                      {loan.returnedAt ? "Completed" : "Active"}
                    </span>
                    <span className="earnings-report__row-amount">
                      ${(Number(loan.totalPrice) || Number(loan.price) || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="earnings-report__total">
                <span>Total earned</span>
                <span>${totalEarned.toFixed(2)}</span>
              </div>
            </>
          )}

          <div className="earnings-report__suggestions">
            <h3>Ways to earn more</h3>
            <ul>
              <li>List more than one tool — owners with several listings get discovered more often.</li>
              <li>Respond quickly to rental requests to build a strong reputation.</li>
              <li>Keep your availability calendar up to date so renters can book without asking first.</li>
              <li>Add clear photos and an honest description — listings with more detail get rented more often.</li>
            </ul>
          </div>
        </div>
      )}

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
        <h2>My Listings</h2>
        {isListingsLoading ? (
          <p className="account-page__empty">Loading…</p>
        ) : (
          <ListingGrid
            listings={myListings}
            emptyMessage="You haven't listed any tools yet."
            emptyCta={{ to: "/listings/new", label: "List your first tool →" }}
            onToggleActive={handleToggleListingActive}
          />
        )}
      </section>

      <section className="account-page__section">
        <h2>Previous Tools Rented</h2>
        {isLoading ? (
          <p className="account-page__empty">Loading…</p>
        ) : (
          <LoanGrid
            loans={rented}
            emptyMessage="You haven't rented any tools yet."
            emptyCta={{ to: "/catalog", label: "Browse the catalog →" }}
            onOpenChat={setActiveChatLoan}
          />
        )}
      </section>

      <section className="account-page__section">
        <h2>Tools You Have Lent Out</h2>
        {isLoading ? (
          <p className="account-page__empty">Loading…</p>
        ) : (
          <LoanGrid
            loans={lentOut}
            emptyMessage="You haven't lent out any tools yet."
            emptyCta={{ to: "/listings/new", label: "List a tool →" }}
          />
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

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleEditSubmit}>
          <ImageUpload
            label="Profile photo"
            existingUrl={editPhotoUrl}
            onUploaded={setEditPhotoUrl}
          />

          <div className="account-edit__row">
            <Input
              label="First Name"
              name="firstName"
              value={editValues.firstName}
              onChange={handleEditChange}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={editValues.lastName}
              onChange={handleEditChange}
            />
          </div>

          <Input
            label="Home Address"
            name="homeAddress"
            value={editValues.homeAddress}
            onChange={handleEditChange}
          />

          <div className="account-edit__row">
            <Input
              label="City"
              name="city"
              value={editValues.city}
              onChange={handleEditChange}
            />
            <Input
              label="State"
              name="state"
              value={editValues.state}
              onChange={handleEditChange}
            />
          </div>

          {editError && <p className="account-page__empty" style={{ color: "var(--color-danger)" }}>{editError}</p>}

          <div className="account-edit__actions">
            <Button type="submit" disabled={isSavingEdit}>
              {isSavingEdit ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}