// src/components/ui/Label.jsx
import React from 'react';

export const Label = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="text-gray-700 font-semibold">
      {children}
    </label>
  );
};
