import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import supplierReducer from "./supplierSlice";
import customerReducer from "./customerSlice";
import saleReducer from "./saleSlice";
import dashboardReducer from "./dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    suppliers: supplierReducer,
    customers: customerReducer,
    sales: saleReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
