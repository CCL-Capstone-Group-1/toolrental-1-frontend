import "./Contact.css";

export default function Contact() {
  return (
    <main className="contact-page">
      <h1>Contact Us</h1>
      <p>
        Questions about a rental, a listing, or your account? Reach out and we'll get back to you.
      </p>
      <a className="contact-page__email" href="mailto:support@toolbnb.example">
        support@toolbnb.example
      </a>
    </main>
  );
}
