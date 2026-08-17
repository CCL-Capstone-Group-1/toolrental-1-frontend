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
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const photoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setPhotoName(file ? file.name : "");
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
            {photoName && <span className="signup-photo__name">{photoName}</span>}
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

      <Modal isOpen={isDisclosureOpen} onClose={() => setIsDisclosureOpen(false)} title="Terms & Conditions">
        <h3>Rental Terms</h3>
        <p>
          By creating an account, I agree to be bound by the following terms, which govern the rental,
          borrowing, and lending of tools through this platform.
        </p>
        <h3>Loan of Tools</h3>
        <p>
          I agree to return any borrowed tool in the condition it was received, by the agreed-upon return
          date, and to notify the owner promptly of any damage or malfunction.
        </p>
        <h3>Liability</h3>
        <p>
          I understand that I am responsible for any damage, loss, or theft of a tool while it is in my
          possession, and that the platform is not liable for injuries or damages resulting from tool use.
        </p>
        <h3>Payments</h3>
        <p>
          I authorize the platform to process payments and fees associated with my rentals and listings as
          described at checkout.
        </p>
        <Button type="button" onClick={() => setIsDisclosureOpen(false)}>
          Close
        </Button>
      </Modal>
    </main>
  );
}
