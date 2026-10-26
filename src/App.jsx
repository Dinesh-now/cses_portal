
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import Parents from "./pages/Parents";
import Children from "./pages/Children";
import Payments from "./pages/Payments";
import CourtOrders from "./pages/CourtOrders";
import Reports from "./pages/Reports";

import CaseDetails from "./pages/CaseDetails";
import EditCase from "./pages/EditCase";

import ParentDetails from "./pages/ParentDetails";
import EditParent from "./pages/EditParent";

import ChildDetails from "./pages/ChildDetails";
import EditChild from "./pages/EditChild";

import CourtOrderDetails from "./pages/CourtOrderDetails";
import EditCourtOrder from "./pages/EditCourtOrder";

import Layout from "./Components/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";

import CaseProvider from "./context/CaseContext";
import ParentProvider from "./context/ParentContext";
import ChildProvider from "./context/ChildContext";
import PaymentProvider from "./context/PaymentContext";
import CourtOrderProvider from "./context/CourtOrderContext";

function App() {
  return (
    <BrowserRouter>
      <CaseProvider>
        <ParentProvider>
          <ChildProvider>
            <PaymentProvider>
              <CourtOrderProvider>
                <Routes>
                  {/* Public Login Page */}
                  <Route path="/" element={<Login />} />

                  {/* Protect all application pages */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                      {/* Dashboard */}
                      <Route
                        path="/dashboard"
                        element={<Dashboard />}
                      />

                      {/* Cases */}
                      <Route
                        path="/cases"
                        element={<Cases />}
                      />
                      <Route
                        path="/cases/:id"
                        element={<CaseDetails />}
                      />
                      <Route
                        path="/cases/:id/edit"
                        element={<EditCase />}
                      />

                      {/* Parents */}
                      <Route
                        path="/parents"
                        element={<Parents />}
                      />
                      <Route
                        path="/parents/:id"
                        element={<ParentDetails />}
                      />
                      <Route
                        path="/parents/:id/edit"
                        element={<EditParent />}
                      />

                      {/* Children */}
                      <Route
                        path="/children"
                        element={<Children />}
                      />
                      <Route
                        path="/children/:id/edit"
                        element={<EditChild />}
                      />
                      <Route
                        path="/children/:id"
                        element={<ChildDetails />}
                      />

                      {/* Payments */}
                      <Route
                        path="/payments"
                        element={<Payments />}
                      />

                      {/* Court Orders */}
                      <Route
                        path="/court-orders"
                        element={<CourtOrders />}
                      />
                      <Route
                        path="/court-orders/:id/edit"
                        element={<EditCourtOrder />}
                      />
                      <Route
                        path="/court-orders/:id"
                        element={<CourtOrderDetails />}
                      />

                      {/* Reports */}
                      <Route
                        path="/reports"
                        element={<Reports />}
                      />
                    </Route>
                  </Route>
                </Routes>
              </CourtOrderProvider>
            </PaymentProvider>
          </ChildProvider>
        </ParentProvider>
      </CaseProvider>
    </BrowserRouter>
  );
}

export default App;

