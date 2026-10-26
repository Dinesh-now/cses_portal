
import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ParentContext } from "../context/ParentContext";
import Toast from "../Components/Toast";

const EditParent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { parentList, updateParent } = useContext(ParentContext);

  // Find the selected parent
  const selectedParent = parentList.find(
    (item) => String(item.id) === String(id)
  );

  // Form state
  const [formData, setFormData] = useState(() => ({
    id: selectedParent?.id || "",
    name: selectedParent?.name || "",
    email: selectedParent?.email || "",
    phone: selectedParent?.phone || "",
    address: selectedParent?.address || "",
  }));

  // Toast state
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Update parent
  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();

    // Validate required fields
    if (!name || !email || !phone || !address) {
      setToast({
        message: "Please fill in all fields.",
        type: "error",
      });
      return;
    }

    // Basic phone validation
    if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      setToast({
        message: "Please enter a valid phone number.",
        type: "error",
      });
      return;
    }

    // Check for duplicate email
    const emailExists = parentList.some(
      (parent) =>
        String(parent.id) !== String(id) &&
        parent.email?.trim().toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      setToast({
        message: "This email is already used by another parent.",
        type: "error",
      });
      return;
    }

    const updatedParent = {
      ...formData,
      name,
      email,
      phone,
      address,
    };

    updateParent(updatedParent);

    // Show success message on the Parents page
    navigate("/parents", {
      state: { message: "Parent updated successfully!" },
    });
  };

  // Parent not found
  if (!selectedParent) {
    return (
      <div>
        <h2>Parent Not Found</h2>

        <button
          type="button"
          onClick={() => navigate("/parents")}
        >
          Back to Parents
        </button>
      </div>
    );
  }

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ message: "", type: "success" })
        }
      />

      <h1>Edit Parent</h1>

      <form onSubmit={handleSubmit}>
        {/* Parent ID */}
        <div>
          <label htmlFor="parentId">Parent ID</label>
          <br />
          <input
            id="parentId"
            type="text"
            name="id"
            value={formData.id}
            disabled
          />
        </div>

        <br />

        {/* Name */}
        <div>
          <label htmlFor="parentName">Parent Name</label>
          <br />
          <input
            id="parentName"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Email */}
        <div>
          <label htmlFor="parentEmail">Email</label>
          <br />
          <input
            id="parentEmail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Phone */}
        <div>
          <label htmlFor="parentPhone">Phone</label>
          <br />
          <input
            id="parentPhone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Address */}
        <div>
          <label htmlFor="parentAddress">Address</label>
          <br />
          <input
            id="parentAddress"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Buttons */}
        <button type="submit">Update Parent</button>{" "}

        <button
          type="button"
          onClick={() => navigate("/parents")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditParent;
