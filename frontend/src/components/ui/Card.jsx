export const Card = ({ children, className = '' }) => {
  return (
    <div className={`rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};
