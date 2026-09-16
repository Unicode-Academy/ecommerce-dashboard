import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import Categories from "./pages/Categories";
import { Toaster } from "sonner";
import Products from "./pages/Products";
import ProductCreate from "./pages/ProductCreate";
import ProductUpdate from "./pages/ProductUpdate";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products">
            <Route index element={<Products />} />
            <Route path="create" element={<ProductCreate />} />
            <Route path="update/:id" element={<ProductUpdate />} />
          </Route>
          <Route path="/orders">
            <Route index element={<Orders />} />
            <Route path=":id" element={<OrderDetail />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
