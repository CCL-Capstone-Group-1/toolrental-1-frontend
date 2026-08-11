import { useAuth } from "../context/AuthContext";

export default function UserAccount() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading account...</div>;
  }

  return (
    <div className="account-page">
      <h1>My Account</h1>
      {user ? (
        <div className="account-details">
          <p><strong>Name:</strong> {user.name || user.email}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button type="button" onClick={logout}>
            Sign Out
          </button>
        </div>
      ) : (
        <p>No authenticated user found.</p>
      )}
    </div>
  );
}
