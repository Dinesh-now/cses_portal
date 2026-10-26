
import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { CaseContext } from "../context/CaseContext";

const CaseDetails = () => {
  const { id } = useParams();
  const { caseList } = useContext(CaseContext);

  const selectedCase = caseList.find(
    (item) => String(item.id) === String(id)
  );

  if (!selectedCase) {
    return (
      <div className="details-container">
        <h1>Case Not Found</h1>
        <p>The requested case could not be found.</p>
        <Link to="/cases">Back to Cases</Link>
      </div>
    );
  }

  return (
    <div className="details-container">
      <h1>Case Details</h1>

      <div className="details-card">
        <p>
          <strong>Case ID:</strong> {selectedCase.id}
        </p>

        <p>
          <strong>Parent Name:</strong> {selectedCase.parentName}
        </p>

        <p>
          <strong>Child Name:</strong> {selectedCase.childName}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`status-badge ${String(
              selectedCase.status || ""
            ).toLowerCase()}`}
          >
            {selectedCase.status}
          </span>
        </p>

        <p>
          <strong>Monthly Amount:</strong>{" "}
          ₹{Number(selectedCase.monthlyAmount || 0).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="details-actions">
        <Link to="/cases">Back to Cases</Link>

        {" | "}

        <Link to={`/cases/${selectedCase.id}/edit`}>
          Edit Case
        </Link>
      </div>
    </div>
  );
};

export default CaseDetails;

