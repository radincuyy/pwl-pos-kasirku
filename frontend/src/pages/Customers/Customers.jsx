import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  clearCustomersError,
} from '../../features/customers/customersSlice';
import { CustomerForm } from './CustomerForm';
import { useToast } from '../../components/ui/Toast';

export const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [mode, setMode] = useState('list');
  const [message, setMessage] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addToast({ type: 'error', message: error });
      setMessage({ type: 'error', text: error });
    }
  }, [error, addToast]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createCustomer(data)).unwrap();
      addToast({ type: 'success', message: 'Pelanggan berhasil ditambahkan.' });
      setMode('list');
      setSelectedCustomer(null);
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal menambahkan pelanggan.' });
    }
  };

  const handleUpdate = async (data) => {
    if (!selectedCustomer) return;
    try {
      await dispatch(updateCustomer({ id: selectedCustomer.id, data })).unwrap();
      addToast({ type: 'success', message: 'Pelanggan berhasil diperbarui.' });
      setMode('list');
      setSelectedCustomer(null);
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal memperbarui pelanggan.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pelanggan ini?')) return;
    try {
      await dispatch(deleteCustomer(id)).unwrap();
      addToast({ type: 'success', message: 'Pelanggan berhasil dihapus.' });
    } catch (err) {
      addToast({ type: 'error', message: err || 'Gagal menghapus pelanggan.' });
    }
  };

  const handleStartCreate = () => {
    dispatch(clearCustomersError());
    setMode('create');
    setSelectedCustomer(null);
    setMessage(null);
  };

  const handleStartEdit = (customer) => {
    dispatch(clearCustomersError());
    setMode('edit');
    setSelectedCustomer(customer);
    setMessage(null);
  };

  const formTitle = useMemo(() => {
    if (mode === 'create') return 'Tambah Pelanggan';
    if (mode === 'edit') return 'Ubah Pelanggan';
    return 'Pelanggan';
  }, [mode]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{formTitle}</h1>
          <p className="text-gray-600">Total pelanggan: {customers.length}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleStartCreate}
            className="bg-blue-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            Tambah Pelanggan
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {(mode === 'create' || mode === 'edit') && (
        <CustomerForm initialValues={selectedCustomer} onSubmit={mode === 'edit' ? handleUpdate : handleCreate} loading={loading} />
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
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    Tidak ada pelanggan untuk ditampilkan.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{customer.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{customer.email || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{customer.phone || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
                      <button type="button" onClick={() => handleStartEdit(customer)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Edit</button>
                      <button type="button" onClick={() => handleDelete(customer.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">Hapus</button>
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
