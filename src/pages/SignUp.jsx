import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Modal from "../components/Modal";
import "./SignUp.css";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
  "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY",
];

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  homeAddress: "",
  aptNumber: "",
  city: "",
  state: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
  eSignature: "",
};

export default function SignUp() {
  const navigate = useNavigate();
  const { register, error, isLoading } = useAuth();
  const [values, setValues] = useState(emptyForm);
  const [photoName, setPhotoName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const photoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    setPhotoUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setPhotoUrl(data.secure_url);
    } catch (err) {
      setPhotoUrl(null);
      setFormError("Photo upload failed — you can still sign up without one.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.firstName.trim()) nextErrors.firstName = "Required.";
    if (!values.lastName.trim()) nextErrors.lastName = "Required.";
    if (!values.email.trim()) nextErrors.email = "Required.";
    if (!values.homeAddress.trim()) nextErrors.homeAddress = "Required.";
    if (!values.city.trim()) nextErrors.city = "Required.";
    if (!values.state) nextErrors.state = "Required.";
    if (!values.password) nextErrors.password = "Required.";
    if (values.password && values.password.length < 8) {
      nextErrors.password = "Must be at least 8 characters.";
    }
    if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Passwords don't match.";
    }
    if (!values.agreeToTerms) nextErrors.agreeToTerms = "You must agree to continue.";
    if (values.agreeToTerms && !values.eSignature.trim()) {
      nextErrors.eSignature = "Please sign your full name.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        homeAddress: values.homeAddress,
        aptNumber: values.aptNumber,
        city: values.city,
        state: values.state,
        password: values.password,
        eSignature: values.eSignature,
        avatarUrl: photoUrl,
      });
      navigate("/account", { replace: true });
    } catch (err) {
      setFormError(err.message || "Unable to register.");
    }
  };

  return (
    <main className="auth-page">
      <h1>Sign Up</h1>

      <form id="signup-form" className="auth-card" onSubmit={handleSubmit}>
        <div className="signup-row">
          <Input
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <div className="signup-row signup-row--email">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />
          <div className="signup-photo">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="signup-photo__input"
              onChange={handlePhotoChange}
            />
            <Button type="button" variant="secondary" onClick={() => photoInputRef.current?.click()}>
              Upload profile photo
            </Button>
            {photoName && (
              <span className="signup-photo__name">
                {photoUploading ? "Uploading..." : photoName}
              </span>
            )}
          </div>
        </div>

        <Input
          label="Home Address"
          name="homeAddress"
          value={values.homeAddress}
          onChange={handleChange}
          error={errors.homeAddress}
        />

        <Input
          label="Apt #, P.O. Box, etc."
          name="aptNumber"
          value={values.aptNumber}
          onChange={handleChange}
        />

        <div className="signup-row">
          <Input label="City" name="city" value={values.city} onChange={handleChange} error={errors.city} />
          <div className="field">
            <label htmlFor="state" className="field__label">
              State
            </label>
            <select
              id="state"
              name="state"
              className="field__control"
              value={values.state}
              onChange={handleChange}
            >
              <option value="">Select…</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <span className="field__error">{errors.state}</span>}
          </div>
        </div>

        <Input
          label="Create Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div className="signup-disclosure">
          <label htmlFor="agreeToTerms" className="signup-disclosure__label">
            Disclosure
          </label>
          <div className="signup-row signup-row--disclosure">
            <label className="signup-disclosure__checkbox">
              <input
                id="agreeToTerms"
                type="checkbox"
                name="agreeToTerms"
                checked={values.agreeToTerms}
                onChange={handleChange}
              />
              <span>
                Agree to{" "}
                <button type="button" className="signup-disclosure__link" onClick={() => setIsDisclosureOpen(true)}>
                  terms and conditions
                </button>
              </span>
            </label>

            <Input
              label="E-Sig"
              name="eSignature"
              value={values.eSignature}
              onChange={handleChange}
              error={errors.eSignature}
            />
          </div>
          {errors.agreeToTerms && <span className="field__error">{errors.agreeToTerms}</span>}
        </div>
      </form>

      {(formError || error) && <p className="auth-page__error">{formError || error}</p>}

      <div className="auth-page__actions">
        <Button type="submit" form="signup-form" disabled={isLoading}>
          {isLoading ? "Submitting…" : "Submit"}
        </Button>
      </div>

      <Modal
        isOpen={isDisclosureOpen}
        onClose={() => setIsDisclosureOpen(false)}
        title="Tool Lending Library — Terms of Rental"
      >
        <p>
          By creating an account, I agree to the following terms, which apply whenever I rent a tool from
          another member (as a Renter) or list a tool for others to rent (as an Owner).
        </p>

        <hr className="signup-disclosure-modal__divider" />

        <h3>As a Renter</h3>

        <p>
          <strong>Rental Period.</strong> I will return any tool I rent by the agreed return date and time,
          in the same condition it was received, allowing for normal wear and tear.
        </p>
        <p>
          <strong>Security Deposit.</strong> A refundable security deposit equal to 25% of a tool's
          replacement value (minimum $50) will be held at checkout for each rental. This deposit is security
          against provable loss or damage, not a penalty, and will be refunded in full within 3 business days
          of a confirmed, undamaged, on-time return.
        </p>
        <p>
          <strong>Lost or Stolen Items.</strong> If a tool I've rented is lost, stolen, or not returned, I am
          obligated to reimburse its full replacement value. This charge applies in addition to any rental
          fees already paid, and is separate from the security deposit, which will also be forfeited.
        </p>
        <p>
          <strong>Damaged Items.</strong> If a tool is returned damaged beyond normal wear and tear, I agree
          to pay the cost of repair, or the tool's full replacement value if it is damaged beyond repair, at
          the owner's reasonable discretion. Repair or replacement costs are charged in addition to the
          rental fee, not instead of it.
        </p>
        <p>
          <strong>Late Returns.</strong> If a tool is not returned by its agreed due date, I will be charged
          1.5x the daily rental rate for each additional day it is kept, deducted first from my security
          deposit. If a tool is not returned within 7 days of the due date with no communication, it will be
          treated as lost under the terms above.
        </p>
        <p>
          <strong>Responsible Use.</strong> I will use any rented tool only for its intended purpose, in a
          safe and lawful manner, and will not lend, sublet, or transfer it to anyone else during my rental
          period.
        </p>

        <hr className="signup-disclosure-modal__divider" />

        <h3>As an Owner</h3>

        <p>
          <strong>Accurate Listings.</strong> I will accurately describe each tool's condition, functionality,
          and fair replacement value when creating a listing. I understand that any damage or loss claim will
          be based on the replacement value I provide, so I agree to set it honestly.
        </p>
        <p>
          <strong>Condition Documentation.</strong> I will document each tool's condition with photos before
          handing it off for a rental, and again upon its return, so that any dispute can be resolved fairly
          using that record rather than either party's word alone.
        </p>
        <p>
          <strong>Working Order.</strong> I will only list tools that are in safe, working condition, and will
          disclose any known defects, damage, or limitations to a renter before the rental begins.
        </p>
        <p>
          <strong>Responsiveness.</strong> I will respond to renter questions and coordinate pickup/return in
          good faith and in a timely manner.
        </p>
        <p>
          <strong>Deposit &amp; Fee Disputes.</strong> If I believe a tool was returned damaged, lost, or
          late, I agree to provide documentation (photos, dates, communication) to support any deposit
          deduction or additional charge, rather than assessing charges arbitrarily.
        </p>

        <hr className="signup-disclosure-modal__divider" />

        <h3>Shared Terms</h3>

        <p>
          <strong>Condition Documentation.</strong> Photos of a tool's condition, taken at pickup and return
          by either party, are the basis for resolving any damage dispute — deductions or charges will be
          itemized and tied to documented condition.
        </p>
        <p>
          <strong>Liability.</strong> Tools are rented "as is." Renters assume the risk of injury or property
          damage from a tool's use, except where caused by a defect the Owner knew about and failed to
          disclose. Tool Lending Library facilitates rentals between members but is not a party to individual
          rental transactions and is not responsible for disputes between renter and owner.
        </p>
        <p>
          I have read and agree to these Terms of Rental, both as a Renter and as an Owner.
        </p>

        <Button type="button" className="signup-disclosure-modal__close" onClick={() => setIsDisclosureOpen(false)}>
          Close
        </Button>
      </Modal>
    </main>
  );
}