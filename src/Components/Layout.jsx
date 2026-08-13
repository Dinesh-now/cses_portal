import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <h2>CSES</h2>

        <p className="portal">
          Support Portal
        </p>

        <nav>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/cases">
            Cases
          </Link>

          <Link to="/parents">
            Parents
          </Link>

          <Link to="/children">
            Children
          </Link>

          <Link to="/payments">
            Payments
          </Link>

          <Link to="/court-orders">
            Court Orders
          </Link>

          <Link to="/reports">
            Reports
          </Link>

        </nav>

        <Link className="logout" to="/">
          Logout
        </Link>

      </aside>


      {/* Main Content */}
      <main className="main-content">

        {/* Navbar */}
        <header className="navbar">

          <h2>
            Child Support Enforcement System
          </h2>

          <div className="user">
            Case Worker
          </div>

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