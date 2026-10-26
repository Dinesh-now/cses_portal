
import React, { useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CaseContext } from "../context/CaseContext";
import Toast from "../Components/Toast";

const EditCase = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { caseList, updateCase } = useContext(CaseContext);

  const selectedCase = caseList.find(
    (item) => String(item.id) === String(id)
  );

  const [formData, setFormData] = useState(() => ({
    id: selectedCase?.id || "",
    parentName: selectedCase?.parentName || "",
    childName: selectedCase?.childName || "",
    status: selectedCase?.status || "Active",
    monthlyAmount: selectedCase?.monthlyAmount ?? "",
  }));

  const [toast, setToast] = useState({
    message: "",
    type: "success",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const parentName = formData.parentName.trim();
    const childName = formData.childName.trim();
    const monthlyAmount = Number(formData.monthlyAmount);

    if (!parentName || !childName) {
      showToast("Parent name and child name are required.", "error");
      return;
    }

    if (
      formData.monthlyAmount === "" ||
      !Number.isFinite(monthlyAmount) ||
      monthlyAmount <= 0
    ) {
      showToast("Monthly amount must be greater than zero.", "error");
      return;
    }

    const updatedCase = {
      ...selectedCase,
      parentName,
      childName,
      status: formData.status,
      monthlyAmount,
    };

    updateCase(updatedCase);

    navigate("/cases", {
      state: { message: "Case updated successfully!" },
    });
  };

  if (!selectedCase) {
    return (
      <div>
        <h2>Case Not Found</h2>
        <button type="button" onClick={() => navigate("/cases")}>
          Back to Cases
        </button>
      </div>
    );
  }

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <h1>Edit Case</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="caseId">Case ID</label>
          <br />
          <input
            id="caseId"
            type="text"
            name="id"
            value={formData.id}
            disabled
          />
        </div>

        <br />

        <div>
          <label htmlFor="parentName">Parent Name</label>
          <br />
          <input
            id="parentName"
            type="text"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="childName">Child Name</label>
          <br />
          <input
            id="childName"
            type="text"
            name="childName"
            value={formData.childName}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="status">Status</label>
          <br />
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <br />

        <div>
          <label htmlFor="monthlyAmount">Monthly Amount (₹)</label>
          <br />
          <input
            id="monthlyAmount"
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

        <button type="submit">Update Case</button>

        {" "}

        <button
          type="button"
          onClick={() => navigate("/cases")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditCase;

