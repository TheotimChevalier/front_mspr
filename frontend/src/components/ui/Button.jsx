// src/components/ui/Button.jsx
import React from 'react';

export const Button = ({ children, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white p-2 rounded-md ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
