import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearCategoriesError,
} from '../../features/categories/categoriesSlice';
import { CategoryForm } from './CategoryForm';
import { useToast } from '../../components/ui/Toast';

export const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mode, setMode] = useState('list');
  const [message, setMessage] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addToast({ type: 'error', message: error });
      setMessage({ type: 'error', text: error });
    }
  }, [error, addToast]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createCategory(data)).unwrap();
      addToast({ type: 'success', message: 'Kategori berhasil ditambahkan.' });
      setMode('list');
      setSelectedCategory(null);
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal menambahkan kategori.' });
    }
  };

  const handleUpdate = async (data) => {
    if (!selectedCategory) return;
    try {
      await dispatch(updateCategory({ id: selectedCategory.id, data })).unwrap();
      addToast({ type: 'success', message: 'Kategori berhasil diperbarui.' });
      setMode('list');
      setSelectedCategory(null);
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal memperbarui kategori.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus kategori ini?')) return;
    try {
      await dispatch(deleteCategory(id)).unwrap();
      addToast({ type: 'success', message: 'Kategori berhasil dihapus.' });
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal menghapus kategori.' });
    }
  };

  const handleStartCreate = () => {
    dispatch(clearCategoriesError());
    setMode('create');
    setSelectedCategory(null);
    setMessage(null);
  };

  const handleStartEdit = (category) => {
    dispatch(clearCategoriesError());
    setMode('edit');
    setSelectedCategory(category);
    setMessage(null);
  };

  const formTitle = useMemo(() => {
    if (mode === 'create') return 'Tambah Kategori';
    if (mode === 'edit') return 'Ubah Kategori';
    return 'Kategori';
  }, [mode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{formTitle}</h1>
          <p className="mt-2 text-sm text-slate-500">Total kategori: {categories.length}</p>
        </div>
        <button
          type="button"
          onClick={handleStartCreate}
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700"
        >
          Tambah Kategori
        </button>
      </div>

      {message && (
        <div className={`rounded-3xl p-4 text-sm shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-red-50 text-red-700 ring-1 ring-red-200'}`}>
          {message.text}
        </div>
      )}

      {(mode === 'create' || mode === 'edit') && (
        <CategoryForm initialValues={selectedCategory} onSubmit={mode === 'edit' ? handleUpdate : handleCreate} loading={loading} />
      )}

      <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-slate-200">
        <div className="bg-slate-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Daftar Kategori</h2>
          <p className="text-sm text-slate-500">Kelola semua kategori produk Anda di sini.</p>
        </div>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-sm text-slate-500">
                    Tidak ada kategori untuk ditampilkan.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700">{category.name}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{category.description || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 space-x-2">
                      <button type="button" onClick={() => handleStartEdit(category)} className="rounded-full bg-amber-500 px-3 py-1 text-white transition hover:bg-amber-600">Edit</button>
                      <button type="button" onClick={() => handleDelete(category.id)} className="rounded-full bg-rose-600 px-3 py-1 text-white transition hover:bg-rose-700">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
