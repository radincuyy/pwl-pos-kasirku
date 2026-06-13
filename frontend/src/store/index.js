import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import suppliersReducer from '../features/suppliers/suppliersSlice';
import customersReducer from '../features/customers/customersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    categories: categoriesReducer,
    suppliers: suppliersReducer,
    customers: customersReducer,
  },
});

export default store;
