import React from 'react';

export const Input = ({ type, value, onChange, name, className, step, id }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      name={name}
      id={id} 
      step={step}
      className={`p-2 border rounded-md ${className}`}
    />
  );
};
