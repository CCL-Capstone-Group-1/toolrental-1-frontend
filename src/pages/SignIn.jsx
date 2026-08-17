import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import "./SignIn.css";

export default function SignIn() {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuth();
  const [email, setEmail] = useState("user@email.com");
  const [password, setPassword] = useState("toolbnb");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    try {
      await login({ email, password });
      navigate("/account", { replace: true });
    } catch (err) {
      setFormError(err.message || "Unable to sign in.");
    }
  };

  return (
    <main className="auth-page">
      <h1>Sign In</h1>
      <p>Demo login: user@email.com / toolbnb</p>

      <form id="signin-form" className="auth-card" onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </form>

      {(formError || error) && <p className="auth-page__error">{formError || error}</p>}

      <div className="auth-page__actions">
        <Button type="submit" form="signin-form" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Submit"}
        </Button>
      </div>
    </main>
  );
}
