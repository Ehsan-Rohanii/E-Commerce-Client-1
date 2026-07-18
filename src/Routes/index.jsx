import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";
import Home from "../Pages/Home";




const router = createBrowserRouter([
    {
        path:"/",
        element:<Register/>
    },
    {
        path:"/login",
        element: <Login/>
    },
    {
        path:"/home",
        element: <Home/>
    },

])
export default router ;