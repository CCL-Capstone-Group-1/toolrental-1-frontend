import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import "./ListingForm.css";

const emptyListing = { title: "", description: "", category: "", pricePerDay: "" };

export default function ListingForm({ initialValues = emptyListing, onSubmit, submitLabel = "Save Listing" }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = "Title is required.";
    if (!values.pricePerDay || Number(values.pricePerDay) <= 0) {
      nextErrors.pricePerDay = "Enter a price greater than 0.";
    }
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSubmitError(null);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="listing-form" onSubmit={handleSubmit}>
      <Input label="Title" name="title" value={values.title} onChange={handleChange} error={errors.title} />
      <Input label="Category" name="category" value={values.category} onChange={handleChange} />
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
          className="field__control listing-form__textarea"
          rows={4}
          value={values.description}
          onChange={handleChange}
        />
      </div>

      {submitError && <p className="listing-form__submit-error">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
