import { useNavigate } from "react-router-dom";
import ListingForm from "../listings/ListingForm";
import { listingService } from "../services/listingService";
import "./OwnerListing.css";

export default function OwnerListing() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await listingService.createListing(values);
    navigate("/");
  };

  return (
    <main className="owner-listing">
      <h1>List a Tool</h1>
      <ListingForm onSubmit={handleSubmit} submitLabel="Create Listing" />
    </main>
  );
}
