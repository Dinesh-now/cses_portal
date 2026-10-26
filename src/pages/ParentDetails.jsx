
import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { ParentContext } from "../context/ParentContext";

const ParentDetails = () => {
  const { id } = useParams();
  const { parentList } = useContext(ParentContext);

  // Find the selected parent
  const parent = parentList.find(
    (item) => String(item.id) === String(id)
  );

  // Parent not found
  if (!parent) {
    return (
      <div>
        <h2>Parent Not Found</h2>

        <Link to="/parents">
          Back to Parents
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Parent Details</h1>

      <p>View parent information</p>

      <hr />

      <h2>{parent.name}</h2>

      <p>
        <strong>Parent ID:</strong> {parent.id}
      </p>

      <p>
        <strong>Name:</strong> {parent.name}
      </p>

      <p>
        <strong>Email:</strong> {parent.email}
      </p>

      <p>
        <strong>Phone:</strong> {parent.phone}
      </p>

      <p>
        <strong>Address:</strong> {parent.address}
      </p>

      <br />

      <Link to={`/parents/${parent.id}/edit`}>
        Edit Parent
      </Link>

      {" | "}

      <Link to="/parents">
        Back to Parents
      </Link>
    </div>
  );
};

export default ParentDetails;

