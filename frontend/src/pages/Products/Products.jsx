import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearProductsError,
} from '../../features/products/productsSlice';
import { ProductForm } from './ProductForm';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Search } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mode, setMode] = useState('list');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addToast({ type: 'error', message: error });
      setMessage({ type: 'error', text: error });
    }
  }, [error, addToast]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createProduct(data)).unwrap();
      addToast({ type: 'success', message: 'Produk berhasil ditambahkan.' });
      setMode('list');
      setSelectedProduct(null);
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal menambahkan produk.' });
    }
  };

  const handleUpdate = async (data) => {
    if (!selectedProduct) return;
    try {
      await dispatch(updateProduct({ id: selectedProduct.id, data })).unwrap();
      addToast({ type: 'success', message: 'Produk berhasil diperbarui.' });
      setMode('list');
      setSelectedProduct(null);
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal memperbarui produk.' });
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      addToast({ type: 'success', message: 'Produk berhasil dihapus.' });
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal menghapus produk.' });
    }
  };

  const handleStartCreate = () => {
    dispatch(clearProductsError());
    setSelectedProduct(null);
    setMode('create');
    setMessage(null);
  };

  const handleStartEdit = (product) => {
    dispatch(clearProductsError());
    setSelectedProduct(product);
    setMode('edit');
    setMessage(null);
  };

  const handleConfirmDelete = (product) => {
    setDeleteTarget(product);
    setDeleteOpen(true);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || String(p.id).includes(q));
  }, [products, query]);

  const formTitle = useMemo(() => {
    if (mode === 'create') return 'Tambah Produk';
    if (mode === 'edit') return 'Ubah Produk';
    return 'Produk';
  }, [mode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{formTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">Total produk: {products.length}</p>
        </div>
        <div className="flex w-full items-center gap-3 md:w-auto">
          <div className="flex-1 md:flex-none">
            <Input
              label={null}
              placeholder="Cari produk, ID, atau nama..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
            <div className="pointer-events-none absolute right-4 top-3 hidden md:block text-slate-400">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <Button onClick={handleStartCreate} className="md:ml-2">Tambah Produk</Button>
        </div>
      </div>

      {message && (
        <div className={`rounded-3xl p-4 text-sm shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-red-50 text-red-700 ring-1 ring-red-200'}`}>
          {message.text}
        </div>
      )}

      {(mode === 'create' || mode === 'edit') && (
        <ProductForm
          initialValues={selectedProduct}
          onSubmit={mode === 'edit' ? handleUpdate : handleCreate}
          loading={loading}
        />
      )}

      <Card>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Daftar Produk</h2>
            <p className="text-sm text-slate-500">Kelola produk yang tersedia dalam inventaris.</p>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="h-12 w-full animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filtered.length === 0 ? (
                <EmptyState
                  title="Belum ada produk"
                  description="Tambahkan produk baru untuk mulai menjual."
                  action={<Button onClick={handleStartCreate}>Tambah Produk</Button>}
                />
              ) : (
                <table className="min-w-full table-auto divide-y divide-slate-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Produk</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Harga</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Stok</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filtered.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-slate-100" />
                            <div>
                              <div className="text-sm font-medium text-slate-900">{product.name}</div>
                              <div className="text-xs text-slate-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-middle text-sm text-slate-700">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-4 align-middle text-sm text-slate-700">{product.stock}</td>
                        <td className="px-4 py-4 align-middle text-right text-sm text-slate-700 space-x-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(product)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(product)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-3 py-1 text-white hover:bg-rose-700"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </Card>
      <ConfirmDialog
        open={deleteOpen}
        title="Konfirmasi Penghapusan"
        description={
          deleteTarget
            ? `Apakah Anda yakin ingin menghapus produk ${deleteTarget.name}? Aksi ini tidak dapat dibatalkan.`
            : 'Apakah Anda yakin ingin menghapus produk ini?'
        }
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};
