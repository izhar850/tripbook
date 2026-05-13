import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import PartiesPage from "./pages/PartiesPage";
import BillingPage from "./pages/BillingPage";
import InvoicePreviewPage from "./pages/InvoicePreviewPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/admin"
          element={<AdminPage />}
        />
        <Route path="/parties" element={<PartiesPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/invoice-preview" element={<InvoicePreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}