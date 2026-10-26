
import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PaymentContext } from "../context/PaymentContext";
import Toast from "../Components/Toast";

const Payments = () => {
  const { paymentList, addPayment, deletePayment } =
    useContext(PaymentContext);

  const location = useLocation();
  const navigate = useNavigate();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    caseId: "",
    parentName: "",
    childName: "",
    amount: "",
    paymentDate: "",
    paymentMethod: "Bank Transfer",
    status: "Pending",
  });

  // Toast state
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  // Show Toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Close Toast notification
  const closeToast = () => {
    setToast({ message: "", type: "success" });
  };

  // Display success messages received from other pages
  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, "success");

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location.state, location.pathname, navigate]);

  // Handle form changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      caseId: "",
      parentName: "",
      childName: "",
      amount: "",
      paymentDate: "",
      paymentMethod: "Bank Transfer",
      status: "Pending",
    });
  };

  // Add new payment
  const handleSubmit = (event) => {
    event.preventDefault();

    const caseId = String(formData.caseId || "").trim();
    const parentName = String(formData.parentName || "").trim();
    const childName = String(formData.childName || "").trim();
    const amount = Number(formData.amount);
    const paymentDate = formData.paymentDate;

    // Validate required fields
    if (!caseId || !parentName || !childName || !paymentDate) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    // Validate names
    if (parentName.length < 2 || childName.length < 2) {
      showToast("Parent and child names must contain at least 2 characters.", "error");
      return;
    }

    // Validate payment amount
    if (
      formData.amount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      showToast("Payment amount must be greater than zero.", "error");
      return;
    }

    // Validate payment date
    const selectedDate = new Date(`${paymentDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate > today
    ) {
      showToast("Please select a valid payment date that is not in the future.", "error");
      return;
    }

    // Generate a unique payment ID
    const newPayment = {
      id: `PAY${Date.now()}`,
      caseId,
      parentName,
      childName,
      amount,
      paymentDate,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
    };

    addPayment(newPayment);

    resetForm();
    setShowForm(false);

    showToast("Payment added successfully!", "success");
  };

  // Search and status filtering
  const filteredPayments = paymentList.filter((payment) => {
    const search = String(searchTerm || "").trim().toLowerCase();

    const matchesSearch =
      String(payment.id || "").toLowerCase().includes(search) ||
      String(payment.caseId || "").toLowerCase().includes(search) ||
      String(payment.parentName || "").toLowerCase().includes(search) ||
      String(payment.childName || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      String(payment.status || "").toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Delete payment
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) {
      return;
    }

    deletePayment(id);

    showToast("Payment deleted successfully!", "success");
  };

  // Format currency
  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Calculate payment totals
  const completedPayments = paymentList.filter(
    (payment) =>
      String(payment.status || "").toLowerCase() === "completed"
  );

  const pendingPayments = paymentList.filter(
    (payment) =>
      String(payment.status || "").toLowerCase() === "pending"
  );

  const failedPayments = paymentList.filter(
    (payment) =>
      String(payment.status || "").toLowerCase() === "failed"
  );

  const totalCompletedAmount = completedPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  return (
    <div className="payments-page">
      {/* Page Heading */}
      <h1>Payments Management</h1>
      <p>Manage and track child support payments.</p>

      {/* Toast Notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <hr />

      {/* Payment Summary */}
      <section className="payment-summary">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Payments</h3>
            <h2>{paymentList.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Completed</h3>
            <h2>{completedPayments.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Pending</h3>
            <h2>{pendingPayments.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Failed</h3>
            <h2>{failedPayments.length}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Amount Collected</h3>
            <h2>{formatAmount(totalCompletedAmount)}</h2>
          </div>
        </div>
      </section>

      {/* Search, Filter, and Add Button */}
      <section className="payment-list-section">
        <div className="payment-controls">
          <input
            className="search-input"
            type="text"
            placeholder="Search by payment ID, case ID, parent, or child..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search payments"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter payments by status"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <button
            type="button"
            onClick={() => setShowForm((previous) => !previous)}
          >
            {showForm ? "Cancel" : "Add Payment"}
          </button>
        </div>

        {/* Add Payment Form */}
        {showForm && (
          <section className="payment-form-section">
            <h2>Add New Payment</h2>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="caseId">Case ID</label>
                <input
                  id="caseId"
                  type="text"
                  name="caseId"
                  value={formData.caseId}
                  onChange={handleChange}
                  placeholder="Example: CSES001"
                  required
                />
              </div>

              <div>
                <label htmlFor="parentName">Parent Name</label>
                <input
                  id="parentName"
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label htmlFor="childName">Child Name</label>
                <input
                  id="childName"
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="paymentDate">Payment Date</label>
                <input
                  id="paymentDate"
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  max={new Date().toLocaleDateString("en-CA")}
                  required
                />
              </div>

              <div>
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label htmlFor="paymentStatus">Payment Status</label>
                <select
                  id="paymentStatus"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="payment-form-actions">
                <button type="submit">Save Payment</button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Payment Records */}
        <h2>Payment Records</h2>

        <p>
          Showing {filteredPayments.length} of {paymentList.length} payments
        </p>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Case ID</th>
                <th>Parent Name</th>
                <th>Child Name</th>
                <th>Amount (₹)</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.caseId}</td>
                    <td>{payment.parentName}</td>
                    <td>{payment.childName}</td>
                    <td>{formatAmount(payment.amount)}</td>
                    <td>{payment.paymentDate}</td>
                    <td>{payment.paymentMethod}</td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          payment.status || ""
                        ).toLowerCase()}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(payment.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">
                    {searchTerm.trim() || statusFilter !== "All"
                      ? "No payments match your search or filter."
                      : "No payment records available. Add a payment to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Payments;
