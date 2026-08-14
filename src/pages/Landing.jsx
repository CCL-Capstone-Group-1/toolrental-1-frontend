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
        <h1>Welcome to toolbnb</h1>
        <p>Building community one neighborhood at a time</p>
      </section>

      <section className="landing__signup">
        <Link to="/register">
          <Button variant="primary">Sign Up</Button>
        </Link>
      </section>

      <section className="landing__feature" style={{ backgroundImage: `url(${findToolsImage})` }}>
        <div className="landing__callout landing__callout--left">
          Find the tools you need in your area and borrow them for the time they can spare.
        </div>
      </section>

      <section className="landing__feature" style={{ backgroundImage: `url(${borrowImage})` }}>
        <div className="landing__callout landing__callout--right">
          Borrow for less than what you would pay full price for a tool you may never use again.
        </div>
      </section>

      <section className="landing__closing">
        <p>
          Find and rent the tools that you might not be able to afford for the job that needs doing. Even
          better, rent them from your neighbors! Your neighborhood, town or even city can get you set up for
          success in your personal projects. Sign up below to get started!
        </p>
      </section>

      <footer className="landing__footer" />
    </main>
  );
}
