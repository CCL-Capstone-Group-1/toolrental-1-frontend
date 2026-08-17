import "./Button.css";

export default function Button({ variant = "primary", type = "button", className = "", children, ...rest }) {
  return (
    <button type={type} className={`btn btn--${variant}${className ? ` ${className}` : ""}`} {...rest}>
      {children}
    </button>
  );
}
