import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listingService } from "../services/listingService";
import Input from "../components/Input";
import Button from "../components/Button";
import ImageUpload from "../components/ImageUpload";
import "./OwnerListing.css";

const PAYOUT_METHODS = ["Cash App", "PayPal", "Venmo"];

const CATEGORY_OPTIONS = ["Power Tools", "Hand Tools", "Yard Tools", "Other"];

const TOOL_TYPE_OPTIONS = [
  "Drill",
  "Circular Saw",
  "Miter Saw",
  "Sander",
  "Router",
  "Air Compressor",
  "Hammer",
  "Wrench Set",
  "Screwdriver Set",
  "Level",
  "Pipe Wrench",
  "Push Lawn Mower",
  "String Trimmer",
  "Leaf Blower",
  "Chainsaw",
  "Pressure Washer",
  "Other",
];

const emptyForm = {
  title: "",
  toolType: "",
  category: "",
  availabilityStart: "",
  availabilityEnd: "",
  description: "",
  pricePerDay: "",
};

export default function OwnerListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [values, setValues] = useState(emptyForm);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [payoutMethod, setPayoutMethod] = useState("card");
  const [payoutInfo, setPayoutInfo] = useState({ name: "", number: "", expDate: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayoutChange = (e) => {
    const { name, value } = e.target;
    setPayoutInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = "Title is required.";
    if (!values.category) nextErrors.category = "Please select a category.";
    if (!values.toolType) nextErrors.toolType = "Please select a tool type.";
    if (!values.pricePerDay || Number(values.pricePerDay) <= 0) {
      nextErrors.pricePerDay = "Enter a price greater than 0.";
    }
    if (values.availabilityStart && values.availabilityEnd) {
      if (new Date(values.availabilityEnd) < new Date(values.availabilityStart)) {
        nextErrors.availabilityEnd = "End date must be after start date.";
      }
    }
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await listingService.createListing({
        ...values,
        imageUrl: photoUrl,
        ownerId: user?.id,
        payoutMethod,
        ...(payoutMethod === "card" ? { payoutCard: payoutInfo } : {}),
      });
      navigate("/catalog");
    } catch (err) {
      setSubmitError(err.message || "Failed to create listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="owner-listing">
      <h1>List a Tool</h1>

      <div className="owner-terms">
        <div className="owner-terms__card">
          <span className="owner-terms__label">Accurate Listings</span>
          <span className="owner-terms__text">
            Describe each tool's condition, functionality, and fair replacement value honestly —
            damage and loss claims are based on the value you provide.
          </span>
        </div>
        <div className="owner-terms__card">
          <span className="owner-terms__label">Working Order</span>
          <span className="owner-terms__text">
            Only list tools that are safe and in working condition, and disclose any known defects
            before a rental begins.
          </span>
        </div>
        <div className="owner-terms__card">
          <span className="owner-terms__label">Document Condition</span>
          <span className="owner-terms__text">
            Photograph each tool before handoff and after return — this record is what any deposit
            or damage dispute is resolved against.
          </span>
        </div>
      </div>

      <form className="owner-listing-form" onSubmit={handleSubmit}>
        <div className="owner-listing-section">
          <h2>List a Tool</h2>

          <ImageUpload label="Tool photo" onUploaded={setPhotoUrl} />

          <div className="owner-listing-row">
            <Input label="Tool Name" name="title" value={values.title} onChange={handleChange} error={errors.title} />

            <div className="field">
              <label htmlFor="toolType" className="field__label">
                Tool Type
              </label>
              <select
                id="toolType"
                name="toolType"
                className="field__control"
                value={values.toolType}
                onChange={handleChange}
              >
                <option value="">Select…</option>
                {TOOL_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.toolType && <span className="field__error">{errors.toolType}</span>}
            </div>
          </div>

          <div className="owner-listing-row">
            <div className="field">
              <label htmlFor="category" className="field__label">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="field__control"
                value={values.category}
                onChange={handleChange}
              >
                <option value="">Select…</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="field__error">{errors.category}</span>}
            </div>

            <div className="owner-listing-row owner-listing-row--nested">
              <Input
                label="Available From"
                name="availabilityStart"
                type="date"
                value={values.availabilityStart}
                onChange={handleChange}
              />
              <Input
                label="Available Until"
                name="availabilityEnd"
                type="date"
                value={values.availabilityEnd}
                onChange={handleChange}
                error={errors.availabilityEnd}
              />
            </div>
          </div>

          <Input
            label="Price per day ($)"
            name="pricePerDay"
            type="number"
            min="0"
            step="0.01"
            value={values.pricePerDay}
            onChange={handleChange}
            error={errors.pricePerDay}
          />

          <div className="field">
            <label htmlFor="description" className="field__label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="field__control owner-listing-form__textarea"
              rows={4}
              value={values.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="owner-listing-section">
          <h2>Payment</h2>

          <div className="owner-listing-payment">
            <div className="owner-listing-payment__card">
              <h3>Card Information</h3>
              <Input label="Name on card" name="name" value={payoutInfo.name} onChange={handlePayoutChange} />
              <Input label="Card Number" name="number" value={payoutInfo.number} onChange={handlePayoutChange} />
              <div className="owner-listing-row">
                <Input label="Exp Date" name="expDate" value={payoutInfo.expDate} onChange={handlePayoutChange} />
                <Input label="CVV" name="cvv" value={payoutInfo.cvv} onChange={handlePayoutChange} />
              </div>
            </div>

            <div className="owner-listing-payment__alt">
              <h3>Or get paid with:</h3>
              {PAYOUT_METHODS.map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant="primary"
                  className={payoutMethod === method ? "owner-listing-payment__alt-btn--active" : ""}
                  onClick={() => setPayoutMethod(method)}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {submitError && <p className="owner-listing__error">{submitError}</p>}

        <div className="owner-listing__actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Submit"}
          </Button>
        </div>
      </form>
    </main>
  );
}