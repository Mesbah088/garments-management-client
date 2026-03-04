import { createBrowserRouter } from "react-router";
import MainLayout from "../Component/MainLaout/MainLayout";
import ErrorPage from "../Component/MainLaout/Errorpage";
import Home from "../Component/Pages/Home";
import Login from "../Component/Pages/Login";

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
        ]
     
    },
    {
      path: '/login',
      element: <Login></Login>
    }
]);