import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Register from "../Pages/Auth/Register";
import Home from "../Pages/Home";
import LoginOtp from "../Pages/Auth/LoginOtp";
import Slider from "../Components/Slider";
import Categories from "../Pages/Categories";
import Brands from "../Pages/Brands";
import LoginPass from "../Pages/Auth/LoginPass";
import Login from "../Pages/Auth/Login";
import Profile from "../Pages/Profile";
import Order from "../Pages/Order";
import Products from "../Pages/Products";
import NotFound from "../Pages/NotFound";
import ProductDetail from "../Pages/Products/ProductDetails";
import Cart from "../Pages/Cart";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/loginPass",
    element: <LoginPass />,
  },
  {
    path: "/loginOtp",
    element: <LoginOtp />,
  },
  {
    path: "/products/:id",
    element: <ProductDetail />,
  },
  {
    path:"/cart" ,
    element:<Cart/>
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "brands",
        element: <Brands />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/order",
        element: <Order />,
      },
    ],
  },
]);

export default router;
