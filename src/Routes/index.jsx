import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";
import Home from "../Pages/Home";
import LoginOtp from "../Pages/Auth/LoginOtp";
import Slider from "../Components/Slider";
import Categories from "../Pages/Categories";




const router = createBrowserRouter([
    {
        path:"/register",
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
        path:"/",
        element: <Layout/>,
        children: [
            {
                index:true ,
                element:<Home/>,
            },
            {
                path:"categories" ,
                element:<Categories/>
            },
        ],
    },

])
export default router ;