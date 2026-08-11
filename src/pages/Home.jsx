import { mockListings } from "../data/mockListings";

export default function Home() {
  return (
    <div className="page-home">
      <section className="hero">
        <h1>Welcome to the Tool Lending Library</h1>
        <p>Browse available tools, request rentals, and manage your account.</p>
      </section>

      <section className="listing-grid">
        <h2>Featured Tools</h2>
        <div className="cards">
          {mockListings.map((listing) => (
            <article key={listing.id} className="listing-card">
              <img src={listing.imageUrl} alt={listing.toolName} />
              <div className="listing-body">
                <h3>{listing.toolName}</h3>
                <p>{listing.category}</p>
                <p>Owner: {listing.owner}</p>
                <p>${listing.price} per day</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
