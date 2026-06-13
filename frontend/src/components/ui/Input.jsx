import React from 'react';

export const Input = ({ label, placeholder, className = '', ...props }) => {
  return (
    <label className="flex flex-col">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <input
        className={`mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200 ${className}`}
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
};

export default Input;
