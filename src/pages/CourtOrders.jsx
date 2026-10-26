
import React, { useContext, useState, useCallback } from "react";
import { CourtOrderContext } from "../context/CourtOrderContext";
import { Link } from "react-router-dom";
import Toast from "../Components/Toast";

const CourtOrders = () => {
  const {
    courtOrderList,
    addCourtOrder,
    deleteCourtOrder,
  } = useContext(CourtOrderContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    caseId: "",
    parentName: "",
    childName: "",
    orderDate: "",
    monthlyAmount: "",
    status: "Pending",
    description: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = useCallback(() => {
    setToast({ message: "", type: "success" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      caseId: "",
      parentName: "",
      childName: "",
      orderDate: "",
      monthlyAmount: "",
      status: "Pending",
      description: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const caseId = formData.caseId.trim();
    const parentName = formData.parentName.trim();
    const childName = formData.childName.trim();
    const description = formData.description.trim();
    const monthlyAmount = Number(formData.monthlyAmount);

    if (!caseId || !parentName || !childName || !formData.orderDate || !description) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (!Number.isFinite(monthlyAmount) || monthlyAmount <= 0) {
      showToast("Monthly amount must be greater than zero.", "error");
      return;
    }

    const newOrder = {
      id: `CO${Date.now()}`,
      caseId,
      parentName,
      childName,
      orderDate: formData.orderDate,
      monthlyAmount,
      status: formData.status,
      description,
    };

    addCourtOrder(newOrder);

    resetForm();
    setShowForm(false);
    showToast("Court order added successfully!");
  };

  const filteredOrders = courtOrderList.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      String(order.id || "").toLowerCase().includes(search) ||
      String(order.caseId || "").toLowerCase().includes(search) ||
      String(order.parentName || "").toLowerCase().includes(search) ||
      String(order.childName || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this court order?"
    );

    if (confirmed) {
      deleteCourtOrder(id);
      showToast("Court order deleted successfully!");
    }
  };

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <h1>Court Orders Management</h1>
      <p>
        Manage and track court orders related to child support cases.
      </p>

      <hr />

      <div>
        <input
          type="text"
          placeholder="Search by order ID, case ID, parent, or child..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {" "}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        {" "}

        <button
          type="button"
          onClick={() => setShowForm((previous) => !previous)}
        >
          {showForm ? "Cancel" : "Add Court Order"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>Add New Court Order</h2>

          <div>
            <label>Case ID</label>
            <br />
            <input
              type="text"
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
              placeholder="Example: CSES001"
              required
            />
          </div>

          <br />

          <div>
            <label>Parent Name</label>
            <br />
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Child Name</label>
            <br />
            <input
              type="text"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Order Date</label>
            <br />
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Monthly Amount (₹)</label>
            <br />
            <input
              type="number"
              name="monthlyAmount"
              value={formData.monthlyAmount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <br />

          <div>
            <label>Status</label>
            <br />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <br />

          <div>
            <label>Description</label>
            <br />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <br />

          <button type="submit">Save Court Order</button>
          {" "}
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(false);
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <br />

      <h2>Court Order Records</h2>

      <p>Total Court Orders: {courtOrderList.length}</p>

      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Case ID</th>
            <th>Parent Name</th>
            <th>Child Name</th>
            <th>Order Date</th>
            <th>Monthly Amount</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.caseId}</td>
                <td>{order.parentName}</td>
                <td>{order.childName}</td>
                <td>{order.orderDate}</td>
                <td>
                  ₹{Number(order.monthlyAmount || 0).toLocaleString("en-IN")}
                </td>
                <td>
                  <span
                    className={`status-badge ${String(
                      order.status || ""
                    ).toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{order.description}</td>
                <td>
                  <Link to={`/court-orders/${order.id}`}>
                    <button type="button">View</button>
                  </Link>

                  {" "}

                  <Link to={`/court-orders/${order.id}/edit`}>
                    <button type="button">Edit</button>
                  </Link>

                  {" "}

                  <button
                    type="button"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No court orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourtOrders;
