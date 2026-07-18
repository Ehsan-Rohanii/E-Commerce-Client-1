import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";




const router = createBrowserRouter([
    {
        path:"/",
        element:<Register/>
    },
    {
        path:"/login",
        element: <Login/>
    },

])
export default router ;