import { useEffect, useState } from 'react';

export const CategoryForm = ({ initialValues, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || '',
        description: initialValues.description || '',
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Nama Kategori</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="Contoh: Minuman"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Deskripsi</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            rows="4"
            placeholder="Deskripsi kategori"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Menyimpan...' : 'Simpan Kategori'}
      </button>
    </form>
  );
};
