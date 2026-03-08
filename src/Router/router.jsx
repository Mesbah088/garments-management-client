import { createBrowserRouter } from "react-router";


import Home from "../Component/Pages/Home";
import Login from "../Component/Pages/Login";
import MainLayout from "../Component/MainLaout/MainLayout";
import ErrorPage from "../Component/MainLaout/Errorpage";
import AllProduct from "../Component/Pages/AllProduct";
import About from "../Component/Pages/About";
import Contact from "../Component/Pages/Contact";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        errorElement: <ErrorPage/>,
        children:
        [
            {
              index: true,
              path: "/",
              Component: Home,  
            },
            {
              path: '/allproduct',
              element: <AllProduct/>
            },
              {
              path: '/about',
              element: <About/>
            },
                {
              path: '/contact',
              element: <Contact/>
            },
        ]
     
    },
    {
      path: '/login',
      element: <Login></Login>
    }
]);