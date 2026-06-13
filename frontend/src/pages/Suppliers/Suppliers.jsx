import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  clearSuppliersError,
} from '../../features/suppliers/suppliersSlice';
import { SupplierForm } from './SupplierForm';
import { useToast } from '../../components/ui/Toast';

export const Suppliers = () => {
  const dispatch = useDispatch();
  const { suppliers, loading, error } = useSelector((state) => state.suppliers);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [mode, setMode] = useState('list');
  const [message, setMessage] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    dispatch(getSuppliers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addToast({ type: 'error', message: error });
      setMessage({ type: 'error', text: error });
    }
  }, [error, addToast]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createSupplier(data)).unwrap();
      addToast({ type: 'success', message: 'Supplier berhasil ditambahkan.' });
      setMode('list');
      setSelectedSupplier(null);
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal menambahkan supplier.' });
    }
  };

  const handleUpdate = async (data) => {
    if (!selectedSupplier) return;
    try {
      await dispatch(updateSupplier({ id: selectedSupplier.id, data })).unwrap();
      addToast({ type: 'success', message: 'Supplier berhasil diperbarui.' });
      setMode('list');
      setSelectedSupplier(null);
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal memperbarui supplier.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus supplier ini?')) return;
    try {
      await dispatch(deleteSupplier(id)).unwrap();
      addToast({ type: 'success', message: 'Supplier berhasil dihapus.' });
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal menghapus supplier.' });
    }
  };

  const handleStartCreate = () => {
    dispatch(clearSuppliersError());
    setMode('create');
    setSelectedSupplier(null);
    setMessage(null);
  };

  const handleStartEdit = (supplier) => {
    dispatch(clearSuppliersError());
    setMode('edit');
    setSelectedSupplier(supplier);
    setMessage(null);
  };

  const formTitle = useMemo(() => {
    if (mode === 'create') return 'Tambah Supplier';
    if (mode === 'edit') return 'Ubah Supplier';
    return 'Supplier';
  }, [mode]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{formTitle}</h1>
          <p className="text-gray-600">Total supplier: {suppliers.length}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleStartCreate}
            className="bg-blue-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            Tambah Supplier
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {(mode === 'create' || mode === 'edit') && (
        <SupplierForm initialValues={selectedSupplier} onSubmit={mode === 'edit' ? handleUpdate : handleCreate} loading={loading} />
      )}

      <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    Tidak ada supplier untuk ditampilkan.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.email || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.phone || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
                      <button type="button" onClick={() => handleStartEdit(supplier)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Edit</button>
                      <button type="button" onClick={() => handleDelete(supplier.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">Hapus</button>
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
