import "./Modal.css";

export default function Modal({ isOpen, onClose, title, children, className = "" }) {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay${className ? ` ${className}` : ""}`} onClick={onClose}>
      <div className={`modal${className ? ` ${className}` : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
