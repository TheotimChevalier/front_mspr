// src/components/ui/Input.jsx
import React from 'react';

export const Input = ({ type, value, onChange, name, className, step }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      name={name}
      step={step}
      className={`p-2 border rounded-md ${className}`}
    />
  );
};
