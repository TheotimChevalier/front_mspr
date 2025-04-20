// src/components/ui/Card.jsx
import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white p-4 shadow-md rounded-md ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return (
    <div className="p-4">
      {children}
    </div>
  );
};
