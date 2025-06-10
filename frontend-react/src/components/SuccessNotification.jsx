import React, { useEffect } from "react";

export default function SuccessNotification({ open, message, onClose, duration = 2500 }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;
  return (
    <div className="success-notification-fixed">
      <div className="success-notification-content">
        <span className="success-notification-icon">✔</span>
        <span className="success-notification-message">{message}</span>
      </div>
    </div>
  );
}
