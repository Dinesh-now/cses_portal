
import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ParentContext } from "../context/ParentContext";
import Toast from "../Components/Toast";

const Parents = () => {
  const { parentList, addParent, deleteParent } =
    useContext(ParentContext);

  const location = useLocation();
  const navigate = useNavigate();

  // Search state
  const [search, setSearch] = useState("");

  // Add Parent form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
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

  // Show the success message received from EditParent.jsx
  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, "success");

      // Clear the message from navigation state
      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location.state, location.pathname, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Add Parent
  const handleAddParent = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();

    // Check required fields
    if (!name || !email || !phone || !address) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    // Check for duplicate email
    const emailExists = parentList.some(
      (parent) =>
        String(parent.email || "").trim().toLowerCase() ===
        email.toLowerCase()
    );

    if (emailExists) {
      showToast(
        "This email address is already registered.",
        "error"
      );
      return;
    }

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phone)) {
      showToast(
        "Please enter a valid 10-digit phone number.",
        "error"
      );
      return;
    }

    // Generate a unique parent ID
    const nextNumber =
      parentList.reduce((max, parent) => {
        const number = Number(
          String(parent.id).replace(/^P/i, "")
        );

        return Number.isFinite(number)
          ? Math.max(max, number)
          : max;
      }, 0) + 1;

    const newParent = {
      id: `P${String(nextNumber).padStart(3, "0")}`,
      name,
      email,
      phone,
      address,
    };

    addParent(newParent);

    // Clear form after adding
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    showToast("Parent added successfully!", "success");
  };

  // Delete Parent
  const handleDeleteParent = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this parent?"
    );

    if (!confirmDelete) {
      return;
    }

    deleteParent(id);

    showToast("Parent deleted successfully!", "success");
  };

  // Search parents by ID, name, email, or phone
  const filteredParents = parentList.filter((parent) => {
    const searchText = search.trim().toLowerCase();

    return (
      String(parent.id || "").toLowerCase().includes(searchText) ||
      String(parent.name || "").toLowerCase().includes(searchText) ||
      String(parent.email || "").toLowerCase().includes(searchText) ||
      String(parent.phone || "").includes(searchText)
    );
  });

  return (
    <div className="parents-page">
      <h1>Parent Management</h1>
      <p>Manage parents registered in the child support system.</p>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      {/* Add Parent Form */}
      <section className="parent-form-section">
        <h2>Add New Parent</h2>

        <form onSubmit={handleAddParent}>
          <input
            type="text"
            name="name"
            placeholder="Parent Name"
            value={formData.name}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            maxLength={150}
            title="Please enter a valid email address."
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="10-digit Phone Number"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            maxLength={10}
            title="Please enter a valid 10-digit phone number."
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            maxLength={250}
            required
          />

          <button type="submit">Add Parent</button>
        </form>
      </section>

      {/* Search Parents */}
      <section className="parent-list-section">
        <h2>Parent List</h2>

        <input
          className="search-input"
          type="text"
          placeholder="Search by ID, Name, Email or Phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Parents Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Parent ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParents.length > 0 ? (
                filteredParents.map((parent) => (
                  <tr key={parent.id}>
                    <td>{parent.id}</td>
                    <td>{parent.name}</td>
                    <td>{parent.email}</td>
                    <td>{parent.phone}</td>
                    <td>{parent.address}</td>

                    <td>
                      <div className="table-actions">
                        <Link to={`/parents/${parent.id}`}>
                          View
                        </Link>

                        <Link to={`/parents/${parent.id}/edit`}>
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteParent(parent.id)
                          }
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
                    {search
                      ? "No parents match your search."
                      : "No parents available. Add a parent to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Parent Count */}
        <p className="parent-count">
          Showing {filteredParents.length} of {parentList.length} parents
        </p>
      </section>
    </div>
  );
};

export default Parents;
