import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SolutionsDetail from "./pages/SolutionsDetail.tsx";
import LanguagePreference from "./pages/LanguagePreference.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import TrackIDInput from "./pages/TrackParcel.tsx";
import CreateShipment from "./pages/CreateShipment.tsx";
import ShipmentTracker from "./pages/ShipmentTracker.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import ParcelDetails from "./pages/PrcelDetail.tsx";
import AddressChangeRequest from "./pages/AddressChangeRequest.tsx";
import About from "./pages/About.tsx";
import { shipment, updateShipment } from "./actions/shipment.ts";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import EditShipment from "./pages/EditingShipments.tsx";
import "@/i18n/i18n.ts";
import CustomerService from "./pages/CustomerService.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LanguagePreference />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/solutions",
    element: <SolutionsDetail />,
  },
  {
    path: "/language-preference",
    element: <LanguagePreference />,
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/track-parcel",
    element: <TrackIDInput />,
  },
  {
    path: "/create-shipment",
    element: <CreateShipment />,
    action: shipment,
  },
  {
    path: "/shipment-tracking/:id",
    element: <ShipmentTracker />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/parcel/:id",
    element: <ParcelDetails />,
  },
  {
    path: "/customer-support",
    element: <CustomerService />,
  },
  {
    path: "/parcel/:id/edit",
    element: (
      <EditShipment
        onLogout={() => {
          window.location.href = "/admin-dashboard";
        }}
      />
    ),
    action: updateShipment,
  },
  {
    path: "/address-change-request",
    element: <AddressChangeRequest />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
