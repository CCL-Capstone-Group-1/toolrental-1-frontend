import "./Input.css";

export default function Input({ label, name, error, ...rest }) {
  return (
    <div className="field">
      {label && (
        <label htmlFor={name} className="field__label">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`field__control${error ? " field__control--error" : ""}`}
        {...rest}
      />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
