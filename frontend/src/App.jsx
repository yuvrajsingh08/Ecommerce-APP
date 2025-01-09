import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect} from "react";
import {AppContext}  from "./context";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import SignUp from "./pages/SignUp";
import AdminPanel from "./pages/AdminPanel";
import AllUsers from "./pages/AllUsers";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import CategoryProduct from "./pages/CategoryProduct";
import Cart from "./pages/Cart";
import SearchProduct from "./pages/SearchProduct";


function App() {
  
  const { fetchUserDetails, fetchUserAddToCart } = useContext(AppContext);

  useEffect(() => {
    /**user Details */
    fetchUserDetails();
    // console.log("key", process.env.REACT_APP_API_KEY);
    /**user Details cart product */
    fetchUserAddToCart();
  }, []);
  return (
    <>
      <ToastContainer position="top-center" />

      <Header />
      <main className="min-h-[calc(100vh-120px)] pt-16 z-10">
        {/* <Outlet /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/admin-panel" element={<AdminPanel />}>
            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-products" element={<AllProducts />} />
          </Route>
          <Route path="/product-category" element={<CategoryProduct />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchProduct />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
