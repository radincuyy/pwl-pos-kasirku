import { useEffect, useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ProductForm = ({ initialValues, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || '',
        price: initialValues.price?.toString() || '',
        stock: initialValues.stock?.toString() || '',
        description: initialValues.description || '',
      });
    }
  }, [initialValues]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama produk diperlukan.';
    if (form.price === '' || Number.isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Harga tidak valid.';
    if (form.stock === '' || Number.isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Stok tidak valid.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.25rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nama Produk"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Contoh: Sabun Mandi"
          className="w-full"
        />
        {errors.name && <div className="text-sm text-rose-600">{errors.name}</div>}

        <Input
          label="Harga"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="0"
        />
        {errors.price && <div className="text-sm text-rose-600">{errors.price}</div>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Stok"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="0"
        />
        {errors.stock && <div className="text-sm text-rose-600">{errors.stock}</div>}

        <label className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">Deskripsi</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
            rows="4"
            placeholder="Deskripsi produk"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Produk'}
        </Button>
      </div>
    </form>
  );
};
