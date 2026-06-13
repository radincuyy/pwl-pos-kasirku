export const SectionCard = ({ title, description, children, className = '' }) => {
  return (
    <section className={`rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
          {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
};
