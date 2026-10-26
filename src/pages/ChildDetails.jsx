
import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { ChildContext } from "../context/ChildContext";

const ChildDetails = () => {
  const { id } = useParams();
  const { childList } = useContext(ChildContext);

  // Find the selected child
  const child = childList.find(
    (item) => String(item.id) === String(id)
  );

  // Child not found
  if (!child) {
    return (
      <div>
        <h2>Child Not Found</h2>

        <Link to="/children">
          Back to Children
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Child Details</h1>

      <p>View child information</p>

      <hr />

      <h2>{child.name}</h2>

      <p>
        <strong>Child ID:</strong> {child.id}
      </p>

      <p>
        <strong>Name:</strong> {child.name}
      </p>

      <p>
        <strong>Age:</strong> {child.age}
      </p>

      <p>
        <strong>Gender:</strong> {child.gender}
      </p>

      <p>
        <strong>Parent ID:</strong> {child.parentId}
      </p>

      <p>
        <strong>Parent Name:</strong> {child.parentName}
      </p>

      <p>
        <strong>Date of Birth:</strong> {child.dateOfBirth}
      </p>

      <br />

      <Link to={`/children/${child.id}/edit`}>
        Edit Child
      </Link>

      {" | "}

      <Link to="/children">
        Back to Children
      </Link>
    </div>
  );
};

export default ChildDetails;

