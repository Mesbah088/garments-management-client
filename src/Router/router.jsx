import { createBrowserRouter } from "react-router";
import MainLayout from "../Component/MainLaout/MainLayout";
import ErrorPage from "../Component/MainLaout/Errorpage";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        errorElement: <ErrorPage/>,
     
    }
]);