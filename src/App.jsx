import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./Components/Layout";
import Cases from "./pages/Cases";
import Parents from "./pages/Parents";
import Children from "./pages/Children";
import Payments from "./pages/Payments";
import CourtOrders from "./pages/CourtOrders";
import Reports from "./pages/Reports";

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Application Layout */}
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/cases"
            element={<Cases />}
          />

          <Route
            path="/parents"
            element={<Parents />}
          />

          <Route
            path="/children"
            element={<Children />}
          />

          <Route
            path="/payments"
            element={<Payments />}
          />

          <Route
            path="/court-orders"
            element={<CourtOrders />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default App;