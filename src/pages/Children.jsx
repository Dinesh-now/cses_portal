
import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ChildContext } from "../context/ChildContext";
import { ParentContext } from "../context/ParentContext";
import Toast from "../Components/Toast";

const Children = () => {
  const { childList, addChild, deleteChild } = useContext(ChildContext);
  const { parentList } = useContext(ParentContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    parentId: "",
    dateOfBirth: "",
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  // Display Toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: "", type: "success" });
  };

  // Show success message received from EditChild.jsx
  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, "success");

      // Clear navigation state so the message does not appear again
      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location.state, location.pathname, navigate]);

  // Calculate age using date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
      return "";
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Handle form inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => {
      const updatedData = {
        ...previousData,
        [name]: value,
      };

      // Automatically calculate age when date of birth changes
      if (name === "dateOfBirth") {
        updatedData.age = value ? calculateAge(value) : "";
      }

      return updatedData;
    });
  };

  // Add a new child
  const handleAddChild = (event) => {
    event.preventDefault();

    const childName = String(formData.name || "").trim();

    // Validate child name
    if (childName.length < 2) {
      showToast("Please enter a valid child name.", "error");
      return;
    }

    // Validate parent selection
    if (!formData.parentId) {
      showToast("Please select a parent.", "error");
      return;
    }

    // Find the selected parent safely
    const selectedParent = parentList.find(
      (parent) => String(parent.id) === String(formData.parentId)
    );

    if (!selectedParent) {
      showToast("Selected parent was not found. Please select again.", "error");
      return;
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      showToast("Please select the child's date of birth.", "error");
      return;
    }

    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
      showToast("Please select a valid date of birth.", "error");
      return;
    }

    // Calculate age from date of birth
    const age = calculateAge(formData.dateOfBirth);

    if (age === "" || age < 0 || age > 18) {
      showToast("Child's age must be between 0 and 18 years.", "error");
      return;
    }

    // Generate the next child ID
    const nextNumber =
      childList.reduce((maximum, child) => {
        const match = String(child.id || "").match(/^CH(\d+)$/);

        if (match) {
          return Math.max(maximum, Number(match[1]));
        }

        return maximum;
      }, 0) + 1;

    const childId = `CH${String(nextNumber).padStart(3, "0")}`;

    // Create the new child
    const newChild = {
      id: childId,
      name: childName,
      age,
      gender: formData.gender,
      parentId: selectedParent.id,
      parentName: selectedParent.name,
      dateOfBirth: formData.dateOfBirth,
    };

    addChild(newChild);

    // Reset form
    setFormData({
      name: "",
      age: "",
      gender: "",
      parentId: "",
      dateOfBirth: "",
    });

    showToast("Child added successfully!", "success");
  };

  // Delete a child
  const handleDeleteChild = (childId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this child?"
    );

    if (!confirmed) return;

    deleteChild(childId);
    showToast("Child deleted successfully!", "success");
  };

  // Search children by ID, name, parent name, or parent ID
  const filteredChildren = childList.filter((child) => {
    const search = String(searchTerm || "").trim().toLowerCase();

    if (!search) return true;

    return (
      String(child.id || "").toLowerCase().includes(search) ||
      String(child.name || "").toLowerCase().includes(search) ||
      String(child.parentName || "").toLowerCase().includes(search) ||
      String(child.parentId || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="page-container">
      <h1>Children Management</h1>

      {/* Toast notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Add Child Form */}
      <div className="form-container">
        <h2>Add Child</h2>

        {parentList.length === 0 && (
          <p>
            Please add a parent before registering a child.
          </p>
        )}

        <form onSubmit={handleAddChild}>
          <div>
            <label htmlFor="childName">Child Name</label>
            <input
              id="childName"
              type="text"
              name="name"
              placeholder="Enter child name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>

          <div>
            <label htmlFor="childGender">Gender</label>
            <select
              id="childGender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="childDateOfBirth">Date of Birth</label>
            <input
              id="childDateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <label htmlFor="childAge">Age</label>
            <input
              id="childAge"
              type="number"
              name="age"
              placeholder="Age calculated automatically"
              value={formData.age}
              readOnly
            />
          </div>

          <div>
            <label htmlFor="childParent">Select Parent</label>
            <select
              id="childParent"
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              required
              disabled={parentList.length === 0}
            >
              <option value="">Select Parent</option>

              {parentList.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name} ({parent.id})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={parentList.length === 0}>
            Add Child
          </button>
        </form>
      </div>

      {/* Search Children */}
      <div className="search-container">
        <h2>Children List</h2>

        <input
          type="text"
          placeholder="Search by child ID, name, parent name, or parent ID..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {/* Children Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Child ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Parent ID</th>
              <th>Parent Name</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredChildren.length > 0 ? (
              filteredChildren.map((child) => (
                <tr key={child.id}>
                  <td>{child.id}</td>
                  <td>{child.name}</td>
                  <td>{child.age}</td>
                  <td>{child.gender || "-"}</td>
                  <td>{child.parentId || "-"}</td>
                  <td>{child.parentName || "-"}</td>
                  <td>{child.dateOfBirth || "-"}</td>

                  <td>
                    <Link to={`/children/${child.id}`}>
                      View
                    </Link>

                    {" | "}

                    <Link to={`/edit-child/${child.id}`}>
                      Edit
                    </Link>

                    {" | "}

                    <button
                      type="button"
                      onClick={() => handleDeleteChild(child.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  {searchTerm.trim()
                    ? "No children found matching your search."
                    : "No children available. Add a child to get started."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Children;
