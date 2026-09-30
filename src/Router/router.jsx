import { createBrowserRouter } from "react-router";

// Layouts & Error
import MainLayout from "../Component/MainLaout/MainLayout";
import DashboardLayout from "../Component/Dashboard/DashboardLayout";
import ErrorPage from "../Component/MainLaout/Errorpage";

// Public & Private Pages
import Home from "../Component/Pages/Home";
import AllProduct from "../Component/Pages/AllProduct";
import ProductDetails from "../Component/Pages/ProductDetails";
import AiEstimator from "../Component/Pages/AiEstimator";
import About from "../Component/Pages/About";
import Contact from "../Component/Pages/Contact";
import Login from "../Component/Pages/Login";
import Register from "../Component/Pages/Register";

// Dashboard Shared & Index
import DashboardIndex from "../Component/Dashboard/DashboardIndex";
import Profile from "../Component/Dashboard/Profile";

// Dashboard Admin Pages
import AdminDashboard from "../Component/Dashboard/Admin/AdminDashboard";
import ManageUsers from "../Component/Dashboard/Admin/ManageUsers";
import AdminAllProducts from "../Component/Dashboard/Admin/AdminAllProducts";
import AdminAllOrders from "../Component/Dashboard/Admin/AdminAllOrders";

// Dashboard Manager Pages
import AddProduct from "../Component/Dashboard/Manager/AddProduct";
import ManageProducts from "../Component/Dashboard/Manager/ManageProducts";
import PendingOrders from "../Component/Dashboard/Manager/PendingOrders";
import ApprovedOrders from "../Component/Dashboard/Manager/ApprovedOrders";

// Dashboard Buyer Pages
import MyOrders from "../Component/Dashboard/Buyer/MyOrders";
import TrackOrder from "../Component/Dashboard/Buyer/TrackOrder";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "allproduct",
        element: <AllProduct />
      },
      {
        path: "all-products",
        element: <AllProduct />
      },
      {
        path: "all-product",
        element: <AllProduct />
      },
      {
        path: "products",
        element: <AllProduct />
      },
      {
        path: "ai-estimator",
        element: <AiEstimator />
      },
      {
        path: "product/:id",
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        )
      },
      {
        path: "products/:id",
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        )
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // Smart Dashboard Index based on user role (Admin -> AdminDashboard, Manager -> ManageProducts, Buyer -> MyOrders)
      {
        index: true,
        element: <DashboardIndex />
      },

      // Admin Private Routes
      {
        path: "analytics",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        )
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        )
      },
      {
        path: "all-products",
        element: (
          <AdminRoute>
            <AdminAllProducts />
          </AdminRoute>
        )
      },
      {
        path: "all-orders",
        element: (
          <AdminRoute>
            <AdminAllOrders />
          </AdminRoute>
        )
      },

      // Manager Private Routes
      {
        path: "add-product",
        element: (
          <ManagerRoute>
            <AddProduct />
          </ManagerRoute>
        )
      },
      {
        path: "manage-products",
        element: (
          <ManagerRoute>
            <ManageProducts />
          </ManagerRoute>
        )
      },
      {
        path: "pending-orders",
        element: (
          <ManagerRoute>
            <PendingOrders />
          </ManagerRoute>
        )
      },
      {
        path: "approved-orders",
        element: (
          <ManagerRoute>
            <ApprovedOrders />
          </ManagerRoute>
        )
      },

      // Buyer Private Routes
      {
        path: "my-orders",
        element: (
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        )
      },
      {
        path: "track-order/:orderId",
        element: (
          <PrivateRoute>
            <TrackOrder />
          </PrivateRoute>
        )
      },

      // Shared Profile
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: "*",
    element: <ErrorPage />
  }
]);

export default router;