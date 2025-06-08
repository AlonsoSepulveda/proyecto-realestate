import React from "react";

export default function SuccessModal({ open, onClose, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
        <h3 className="text-lg font-bold mb-2 text-green-700">¡Éxito!</h3>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
