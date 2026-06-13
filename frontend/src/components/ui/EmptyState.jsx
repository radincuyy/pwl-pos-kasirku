import { Button } from './Button';

export const EmptyState = ({ title, description, action }) => {
  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-8 text-center shadow-sm">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Kosong</p>
      <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
