import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { CourtOrderContext } from "../context/CourtOrderContext";

const CourtOrderDetails = () => {
const { id } = useParams();
const { courtOrderList } = useContext(CourtOrderContext);

const order = courtOrderList.find((item) => item.id === id);

if (!order) {
return ( <div> <h2>Court Order Not Found</h2> <Link to="/court-orders">Back to Court Orders</Link> </div>
);
}

return ( <div> <h1>Court Order Details</h1> <hr />

  <p><strong>Order ID:</strong> {order.id}</p>
  <p><strong>Case ID:</strong> {order.caseId}</p>
  <p><strong>Parent Name:</strong> {order.parentName}</p>
  <p><strong>Child Name:</strong> {order.childName}</p>
  <p><strong>Order Date:</strong> {order.orderDate}</p>
  <p><strong>Monthly Amount:</strong> ₹{order.monthlyAmount}</p>
  <p><strong>Status:</strong> {order.status}</p>
  <p><strong>Description:</strong> {order.description}</p>

  <br />

  <Link to={`/court-orders/${order.id}/edit`}>
    <button type="button">Edit Court Order</button>
  </Link>

  {" "}

  <Link to="/court-orders">Back to Court Orders</Link>
</div>


);
};

export default CourtOrderDetails;
