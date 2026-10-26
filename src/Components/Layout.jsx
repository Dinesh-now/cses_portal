
import React from "react";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");

    navigate("/", { replace: true });
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>CSES</h2>

        <p className="portal">Support Portal</p>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/cases">Cases</NavLink>
          <NavLink to="/parents">Parents</NavLink>
          <NavLink to="/children">Children</NavLink>
          <NavLink to="/payments">Payments</NavLink>
          <NavLink to="/court-orders">Court Orders</NavLink>
          <NavLink to="/reports">Reports</NavLink>
        </nav>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <h2>Child Support Enforcement System</h2>

          <div className="user">Case Worker</div>
        </header>

        {/* Page Content */}
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
