
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CaseContext } from "../context/CaseContext";
import Toast from "../Components/Toast";

const Cases = () => {
  // Get case data and functions from Context
  const { caseList, addCase, deleteCase } = useContext(CaseContext);

  // Search state
  const [search, setSearch] = useState("");

  // Status filter state
  const [status, setStatus] = useState("All");

  // Add Case form state
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    status: "Active",
    monthlyAmount: "",
  });

  // Toast notification state
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  // Show notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Close notification
  const closeToast = () => {
    setToast({ message: "", type: "success" });
  };

  // Handle Add Case form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Add new case
  const handleAddCase = (e) => {
    e.preventDefault();

    const parentName = formData.parentName.trim();
    const childName = formData.childName.trim();
    const monthlyAmount = Number(formData.monthlyAmount);

    // Validate names
    if (!parentName || !childName) {
      showToast("Please enter both parent and child names.", "error");
      return;
    }

    // Validate monthly amount
    if (
      formData.monthlyAmount === "" ||
      !Number.isFinite(monthlyAmount) ||
      monthlyAmount <= 0
    ) {
      showToast("Monthly amount must be greater than zero.", "error");
      return;
    }

    // Generate the next case ID without relying only on list length
    const nextNumber =
      caseList.reduce((max, item) => {
        const match = String(item.id).match(/^CSES(\d+)$/i);
        const number = match ? Number(match[1]) : 0;
        return Math.max(max, number);
      }, 0) + 1;

    const newCase = {
      id: `CSES${String(nextNumber).padStart(3, "0")}`,
      parentName,
      childName,
      status: formData.status,
      monthlyAmount,
    };

    // Add case through Context
    addCase(newCase);

    // Clear form
    setFormData({
      parentName: "",
      childName: "",
      status: "Active",
      monthlyAmount: "",
    });

    showToast("Case added successfully!", "success");
  };

  // Delete case
  const handleDeleteCase = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this case?"
    );

    if (!confirmDelete) {
      return;
    }

    // Delete through Context
    deleteCase(id);

    showToast("Case deleted successfully!", "success");
  };

  // Search and status filtering
  const filteredCases = caseList.filter((item) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      String(item.id || "").toLowerCase().includes(searchText) ||
      String(item.parentName || "").toLowerCase().includes(searchText) ||
      String(item.childName || "").toLowerCase().includes(searchText);

    const matchesStatus = status === "All" || item.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="cases-page">
      {/* Page Heading */}
      <h1>Case Management</h1>
      <p>Manage child support cases.</p>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      {/* Add New Case */}
      <section className="case-form-section">
        <h2>Add New Case</h2>

        <form onSubmit={handleAddCase}>
          <input
            type="text"
            name="parentName"
            placeholder="Parent Name"
            value={formData.parentName}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />

          <input
            type="text"
            name="childName"
            placeholder="Child Name"
            value={formData.childName}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>

          <input
            type="number"
            name="monthlyAmount"
            placeholder="Monthly Amount"
            value={formData.monthlyAmount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />

          <button type="submit">Add Case</button>
        </form>
      </section>

      {/* Search and Filter */}
      <section className="case-list-section">
        <h2>Case List</h2>

        <div className="case-filters">
          <input
            className="search-input"
            type="text"
            placeholder="Search by Case ID, Parent or Child"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter cases by status"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Cases Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Parent Name</th>
                <th>Child Name</th>
                <th>Status</th>
                <th>Monthly Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCases.length > 0 ? (
                filteredCases.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.parentName}</td>
                    <td>{item.childName}</td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          item.status
                        ).toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      ${Number(item.monthlyAmount || 0).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td>
                      <div className="table-actions">
                        <Link to={`/cases/${item.id}`}>View</Link>

                        <Link to={`/cases/${item.id}/edit`}>Edit</Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteCase(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    {search || status !== "All"
                      ? "No cases match your search or filter."
                      : "No cases available. Add a case to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Case Count */}
        <p className="case-count">
          Showing {filteredCases.length} of {caseList.length} cases
        </p>
      </section>
    </div>
  );
};

export default Cases;

