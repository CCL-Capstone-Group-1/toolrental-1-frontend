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
          <p>a peer-to-peer tool lending library for you and your neighbors</p>
          <Link to="/register" className="landing__hero-signup">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        </div>
      </section>

      <div className="landing__feature">
        <div className="landing__callout">
          <span className="landing__callout-text">
            Borrow tools for less. Lend your tools to your neighbors. Make some extra cash.
          </span>
        </div>
        <div className="landing__feature-image" style={{ backgroundImage: `url(${borrowImage})` }} />
      </div>

      <div className="landing__feature landing__feature--last">
        <div className="landing__callout">
          <span className="landing__callout-text">
            Rent the tools you need from your local neighbors.
          </span>
        </div>
        <div className="landing__feature-image" style={{ backgroundImage: `url(${findToolsImage})` }} />
      </div>

      <section className="landing__trust">
        <span className="landing__trust-eyebrow">Trust &amp; Safety</span>
        <h2>Every rental is backed by an agreement</h2>

        <div className="landing__trust-stats">
          <div className="landing__trust-stat">
            <span className="landing__trust-stat-number">25%</span>
            <span className="landing__trust-stat-label">
              security deposit
              <br />
              (min. $50)
            </span>
          </div>
          <div className="landing__trust-stat">
            <span className="landing__trust-stat-number">1.5×</span>
            <span className="landing__trust-stat-label">
              daily rate charged
              <br />
              per day late
            </span>
          </div>
          <div className="landing__trust-stat">
            <span className="landing__trust-stat-number">100%</span>
            <span className="landing__trust-stat-label">
              replacement value
              <br />
              if lost or stolen
            </span>
          </div>
        </div>

        <p className="landing__trust-copy">
          Every renter agrees to platform-wide rental terms at signup — covering deposits, late fees,
          damage, and loss — so both sides of the transaction know exactly what's expected before a tool
          changes hands.
        </p>
      </section>

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
