import { Link } from "react-router-dom";
import Button from "../components/Button";
import "./Landing.css";

export default function Landing() {
  return (
    <main className="landing">
      <section className="landing__hero">
        <h1>Borrow tools from your neighbors.</h1>
        <p>
          toolbnb connects you with tools nearby so you don&apos;t have to buy what you&apos;ll only use once.
        </p>

        <div className="landing__actions">
          <Link to="/register">
            <Button variant="primary">Sign Up</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">Sign In</Button>
          </Link>
        </div>

        <Link to="/catalog" className="landing__browse-link">
          Browse the catalog without an account →
        </Link>
      </section>
    </main>
  );
}
