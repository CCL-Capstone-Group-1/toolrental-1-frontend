import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} toolbnb</span>
      <Link to="/contact" className="footer__link" viewTransition>
        Contact Us
      </Link>
    </footer>
  );
}
