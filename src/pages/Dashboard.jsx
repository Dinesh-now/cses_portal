import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { CaseContext } from "../context/CaseContext";
import { ParentContext } from "../context/ParentContext";
import { ChildContext } from "../context/ChildContext";
import { PaymentContext } from "../context/PaymentContext";
import { CourtOrderContext } from "../context/CourtOrderContext";

const Dashboard = () => {
  const { caseList } = useContext(CaseContext);
  const { parentList } = useContext(ParentContext);
  const { childList } = useContext(ChildContext);
  const { paymentList } = useContext(PaymentContext);
  const { courtOrderList } = useContext(CourtOrderContext);

  // Payment calculations
  const completedPayments = paymentList.filter(
    (payment) => payment.status === "Completed"
  );

  const pendingPayments = paymentList.filter(
    (payment) => payment.status === "Pending"
  );

  const failedPayments = paymentList.filter(
    (payment) => payment.status === "Failed"
  );

  const completedPaymentAmount = completedPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  // Case calculations
  const activeCases = caseList.filter(
    (item) => item.status === "Active"
  );

  const pendingCases = caseList.filter(
    (item) => item.status === "Pending"
  );

  const closedCases = caseList.filter(
    (item) => item.status === "Closed"
  );

  // Recent payments
  const recentPayments = [...paymentList]
    .sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() -
        new Date(a.paymentDate).getTime()
    )
    .slice(0, 5);

  // Recent cases and parents
  const recentCases = [...caseList].slice(-5).reverse();
  const recentParents = [...parentList].slice(-5).reverse();

  // Dashboard summary cards
  const summaryCards = [
    {
      title: "Total Cases",
      count: caseList.length,
      link: "/cases",
    },
    {
      title: "Active Cases",
      count: activeCases.length,
      link: "/cases",
    },
    {
      title: "Pending Cases",
      count: pendingCases.length,
      link: "/cases",
    },
    {
      title: "Total Parents",
      count: parentList.length,
      link: "/parents",
    },
    {
      title: "Total Children",
      count: childList.length,
      link: "/children",
    },
    {
      title: "Total Payments",
      count: paymentList.length,
      link: "/payments",
    },
    {
      title: "Total Court Orders",
      count: courtOrderList.length,
      link: "/court-orders",
    },
  ];

  return (
    <div className="dashboard">
      <h1>CSES Dashboard</h1>
      <p>Overview of the Child Support Enforcement System.</p>

      {/* System Overview */}
      <section className="dashboard-section">
        <h2>System Overview</h2>

        <div className="dashboard-grid">
          {summaryCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="dashboard-card"
            >
              <h3>{card.title}</h3>
              <h2>{card.count}</h2>
              <span>View details →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Payment Overview */}
      <section className="dashboard-section">
        <h2>Payment Overview</h2>

        <div className="dashboard-grid payment-overview">
          <div className="dashboard-card">
            <h3>Completed Payments</h3>
            <h2>{completedPayments.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Pending Payments</h3>
            <h2>{pendingPayments.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Failed Payments</h3>
            <h2>{failedPayments.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Total Amount Collected</h3>
            <h2>
              ₹{completedPaymentAmount.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>
      </section>

      {/* Case Status Overview */}
      <section className="dashboard-section">
        <h2>Case Status Overview</h2>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Active Cases</h3>
            <h2>{activeCases.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Pending Cases</h3>
            <h2>{pendingCases.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Closed Cases</h3>
            <h2>{closedCases.length}</h2>
          </div>
        </div>
      </section>

      {/* Recent Payments */}
      <section className="dashboard-section">
        <h2>Recent Payments</h2>

        {recentPayments.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Parent Name</th>
                  <th>Child Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.parentName}</td>
                    <td>{payment.childName}</td>
                    <td>
                      ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td>{payment.paymentDate}</td>
                    <td>
                      <span
                        className={`status-badge ${String(
                          payment.status
                        ).toLowerCase()}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No payment records available.</p>
        )}

        <Link to="/payments" className="dashboard-link">
          View All Payments →
        </Link>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <h2>Quick Actions</h2>

        <div className="quick-actions">
          <Link to="/cases">View Cases</Link>
          <Link to="/parents">Manage Parents</Link>
          <Link to="/children">Manage Children</Link>
          <Link to="/payments">Manage Payments</Link>
          <Link to="/court-orders">View Court Orders</Link>
          <Link to="/reports">View Reports</Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="dashboard-section">
        <h2>Recent Activity</h2>

        <div className="dashboard-grid">
          {/* Recent Cases */}
          <div className="dashboard-card">
            <h3>Recent Cases</h3>

            {recentCases.length > 0 ? (
              recentCases.map((item) => (
                <div key={item.id} style={{ marginBottom: "12px" }}>
                  <strong>{item.id}</strong>
                  <p>{item.parentName}</p>

                  <span
                    className={`status-badge ${String(
                      item.status
                    ).toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p>No cases available.</p>
            )}

            <Link to="/cases" className="dashboard-link">
              View All Cases →
            </Link>
          </div>

          {/* Recent Parents */}
          <div className="dashboard-card">
            <h3>Recent Parents</h3>

            {recentParents.length > 0 ? (
              recentParents.map((parent) => (
                <div key={parent.id} style={{ marginBottom: "12px" }}>
                  <strong>{parent.name}</strong>
                  <p>{parent.id}</p>
                  <p>{parent.email}</p>
                </div>
              ))
            ) : (
              <p>No parents available.</p>
            )}

            <Link to="/parents" className="dashboard-link">
              View All Parents →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;