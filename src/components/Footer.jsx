import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} toolbnb</span>
    </footer>
  );
}
