
import React, { useContext } from "react";
import { CaseContext } from "../context/CaseContext";
import { ParentContext } from "../context/ParentContext";
import { ChildContext } from "../context/ChildContext";
import { PaymentContext } from "../context/PaymentContext";
import { CourtOrderContext } from "../context/CourtOrderContext";

const Reports = () => {
  const { caseList } = useContext(CaseContext);
  const { parentList } = useContext(ParentContext);
  const { childList } = useContext(ChildContext);
  const { paymentList } = useContext(PaymentContext);
  const { courtOrderList } = useContext(CourtOrderContext);

  const countStatus = (items, status) =>
    items.filter((item) => item.status === status).length;

  const completedPayments = paymentList.filter(
    (payment) => payment.status === "Completed"
  );

  const pendingPayments = paymentList.filter(
    (payment) => payment.status === "Pending"
  );

  const failedPayments = paymentList.filter(
    (payment) => payment.status === "Failed"
  );

  const totalPayments = completedPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const summaryCards = [
    { title: "Total Cases", count: caseList.length },
    { title: "Total Parents", count: parentList.length },
    { title: "Total Children", count: childList.length },
    { title: "Total Payments", count: paymentList.length },
    { title: "Total Court Orders", count: courtOrderList.length },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      <div className="report-header">
        <div>
          <h1>Reports Management</h1>
          <p>View summaries and statistics for the CSES application.</p>
        </div>

        <button type="button" onClick={handlePrint} className="no-print">
          Print Report
        </button>
      </div>

      <hr />

      <h2>Overall Summary</h2>

      <div className="reports-grid">
        {summaryCards.map((card) => (
          <div className="report-card" key={card.title}>
            <h3>{card.title}</h3>
            <h2>{card.count}</h2>
          </div>
        ))}
      </div>

      <hr />

      <h2>Case Report</h2>

      <table>
        <thead>
          <tr>
            <th>Case Status</th>
            <th>Number of Cases</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <span className="status-badge active">Active</span>
            </td>
            <td>{countStatus(caseList, "Active")}</td>
          </tr>

          <tr>
            <td>
              <span className="status-badge pending">Pending</span>
            </td>
            <td>{countStatus(caseList, "Pending")}</td>
          </tr>

          <tr>
            <td>
              <span className="status-badge closed">Closed</span>
            </td>
            <td>{countStatus(caseList, "Closed")}</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Payment Report</h2>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Completed Payments</h3>
          <h2>{completedPayments.length}</h2>
        </div>

        <div className="report-card">
          <h3>Pending Payments</h3>
          <h2>{pendingPayments.length}</h2>
        </div>

        <div className="report-card">
          <h3>Failed Payments</h3>
          <h2>{failedPayments.length}</h2>
        </div>

        <div className="report-card">
          <h3>Total Amount Collected</h3>
          <h2>₹{totalPayments.toLocaleString("en-IN")}</h2>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Payment Status</th>
            <th>Number of Payments</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <span className="status-badge completed">Completed</span>
            </td>
            <td>{countStatus(paymentList, "Completed")}</td>
          </tr>

          <tr>
            <td>
              <span className="status-badge pending">Pending</span>
            </td>
            <td>{countStatus(paymentList, "Pending")}</td>
          </tr>

          <tr>
            <td>
              <span className="status-badge failed">Failed</span>
            </td>
            <td>{countStatus(paymentList, "Failed")}</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Court Order Report</h2>

      <table>
        <thead>
          <tr>
            <th>Court Order Status</th>
            <th>Number of Orders</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <span className="status-badge active">Active</span>
            </td>
            <td>{countStatus(courtOrderList, "Active")}</td>
          </tr>

          <tr>
            <td>
              <span className="status-badge pending">Pending</span>
            </td>
            <td>{countStatus(courtOrderList, "Pending")}</td>
          </tr>

          <tr>
            <td>
              <span className="status-badge completed">Completed</span>
            </td>
            <td>{countStatus(courtOrderList, "Completed")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
