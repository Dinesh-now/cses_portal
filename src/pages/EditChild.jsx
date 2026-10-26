
import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChildContext } from "../context/ChildContext";
import { ParentContext } from "../context/ParentContext";
import Toast from "../Components/Toast";

const EditChild = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { childList, updateChild } = useContext(ChildContext);
  const { parentList } = useContext(ParentContext);

  // Find the selected child
  const selectedChild = childList.find(
    (item) => String(item.id) === String(id)
  );

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const birthDate = new Date(`${dateOfBirth}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
      return "";
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    const birthdayNotReached =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());

    if (birthdayNotReached) {
      age--;
    }

    return age;
  };

  // Get today's date for the date input limit
  const today = new Date();
  const maxDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Female",
    parentId: "",
    dateOfBirth: "",
  });

  // Toast state
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  // Load selected child data
  useEffect(() => {
    if (selectedChild) {
      setFormData({
        name: selectedChild.name || "",
        age:
          selectedChild.dateOfBirth
            ? calculateAge(selectedChild.dateOfBirth)
            : selectedChild.age ?? "",
        gender: selectedChild.gender || "Female",
        parentId: String(selectedChild.parentId || ""),
        dateOfBirth: selectedChild.dateOfBirth || "",
      });
    }
  }, [selectedChild]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
      ...(name === "dateOfBirth"
        ? { age: calculateAge(value) }
        : {}),
    }));
  };

  // Update child
  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();

    if (name.length < 2) {
      setToast({
        message: "Child name must contain at least 2 characters.",
        type: "error",
      });
      return;
    }

    if (!formData.dateOfBirth) {
      setToast({
        message: "Please select the child's date of birth.",
        type: "error",
      });
      return;
    }

    const age = calculateAge(formData.dateOfBirth);

    if (age === "" || age < 0 || age > 21) {
      setToast({
        message: "Please enter a valid date of birth for a child aged 0–21.",
        type: "error",
      });
      return;
    }

    const selectedParent = parentList.find(
      (parent) => String(parent.id) === String(formData.parentId)
    );

    if (!selectedParent) {
      setToast({
        message: "Please select a valid parent.",
        type: "error",
      });
      return;
    }

    const updatedChild = {
      ...selectedChild,
      name,
      age,
      gender: formData.gender,
      parentId: selectedParent.id,
      parentName: selectedParent.name,
      dateOfBirth: formData.dateOfBirth,
    };

    updateChild(updatedChild);

    // Show success message on the Children page
    navigate("/children", {
      state: { message: "Child updated successfully!" },
    });
  };

  // Child not found
  if (!selectedChild) {
    return (
      <div>
        <h2>Child Not Found</h2>

        <button
          type="button"
          onClick={() => navigate("/children")}
        >
          Back to Children
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

      <h1>Edit Child</h1>

      <form onSubmit={handleSubmit}>
        {/* Child ID */}
        <div>
          <label htmlFor="childId">Child ID</label>
          <br />
          <input
            id="childId"
            type="text"
            value={selectedChild.id}
            disabled
          />
        </div>

        <br />

        {/* Child Name */}
        <div>
          <label htmlFor="childName">Child Name</label>
          <br />
          <input
            id="childName"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />
        </div>

        <br />

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <br />
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={maxDate}
            required
          />
        </div>

        <br />

        {/* Age */}
        <div>
          <label htmlFor="age">Age</label>
          <br />
          <input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            readOnly
          />
          <small>Age is calculated automatically from the date of birth.</small>
        </div>

        <br />

        {/* Gender */}
        <div>
          <label htmlFor="gender">Gender</label>
          <br />
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <br />

        {/* Parent */}
        <div>
          <label htmlFor="parentId">Parent</label>
          <br />
          <select
            id="parentId"
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
            required
          >
            <option value="">Select Parent</option>

            {parentList.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name} ({parent.id})
              </option>
            ))}
          </select>
        </div>

        <br />

        {/* Buttons */}
        <button type="submit">Update Child</button>{" "}

        <button
          type="button"
          onClick={() => navigate("/children")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditChild;
