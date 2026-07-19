import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";
import Home from "../Pages/Home";
import LoginOtp from "../Pages/Auth/LoginOtp";




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
        path:"/loginOtp" ,
        element:<LoginOtp/>
    },
    {
        path:"/layout",
        element: <Layout/>,
        children: [
            {
                index:true ,
                element:<Home/>
            },
        ],
    },

])
export default router ;