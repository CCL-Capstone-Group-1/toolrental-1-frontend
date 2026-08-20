import { Link } from "react-router-dom";
import Button from "../components/Button";
import "./Landing.css";

const heroImage =
  "https://images.pexels.com/photos/1249610/pexels-photo-1249610.jpeg?auto=compress&cs=tinysrgb&w=1600&h=600&fit=crop";
const findToolsImage =
  "https://images.pexels.com/photos/313776/pexels-photo-313776.jpeg?auto=compress&cs=tinysrgb&w=1600&h=600&fit=crop";
const borrowImage =
  "https://images.pexels.com/photos/4162016/pexels-photo-4162016.jpeg?auto=compress&cs=tinysrgb&w=1600&h=600&fit=crop";

export default function Landing() {
  return (
    <main className="landing">
      <section className="landing__hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="landing__hero-box">
          <h1>Welcome to toolbnb</h1>
          <p>Building community one neighborhood at a time</p>
          <Link to="/register" className="landing__hero-signup">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        </div>
      </section>

      <div className="landing__feature">
        <div className="landing__callout">
          <span className="landing__callout-text">
            Borrow for less than what you would pay full price for a tool you may never use again.
          </span>
        </div>
        <div className="landing__feature-image" style={{ backgroundImage: `url(${borrowImage})` }} />
      </div>

      <div className="landing__feature landing__feature--last">
        <div className="landing__callout">
          <span className="landing__callout-text">
            Find the tools you need from people in your area and borrow them for the time they can spare.
          </span>
        </div>
        <div className="landing__feature-image" style={{ backgroundImage: `url(${findToolsImage})` }} />
      </div>

      <section className="landing__closing">
        <Link to="/catalog" className="landing__closing-browse">
          <span className="landing__closing-browse-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          <span className="landing__closing-browse-label">Browse Catalog</span>
        </Link>
      </section>
    </main>
  );
}
