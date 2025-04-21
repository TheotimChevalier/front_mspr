// src/components/ui/Select.jsx
import React from "react";

export function Select({ value, onChange, options, label, name }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="p-2 border rounded-md"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
