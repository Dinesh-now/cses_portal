import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourtOrderContext } from "../context/CourtOrderContext";

const EditCourtOrder = () => {
const { id } = useParams();
const navigate = useNavigate();

const { courtOrderList, updateCourtOrder } =
useContext(CourtOrderContext);

const selectedOrder = courtOrderList.find((item) => item.id === id);

const [formData, setFormData] = useState({
caseId: "",
parentName: "",
childName: "",
orderDate: "",
monthlyAmount: "",
status: "Pending",
description: "",
});

useEffect(() => {
if (selectedOrder) {
setFormData({
caseId: selectedOrder.caseId,
parentName: selectedOrder.parentName,
childName: selectedOrder.childName,
orderDate: selectedOrder.orderDate,
monthlyAmount: selectedOrder.monthlyAmount,
status: selectedOrder.status,
description: selectedOrder.description,
});
}
}, [selectedOrder]);

const handleChange = (e) => {
const { name, value } = e.target;

setFormData((previousData) => ({
  ...previousData,
  [name]: value,
}));


};

const handleSubmit = (e) => {
e.preventDefault();


const updatedOrder = {
  ...selectedOrder,
  caseId: formData.caseId.trim(),
  parentName: formData.parentName.trim(),
  childName: formData.childName.trim(),
  orderDate: formData.orderDate,
  monthlyAmount: Number(formData.monthlyAmount),
  status: formData.status,
  description: formData.description.trim(),
};

updateCourtOrder(updatedOrder);

alert("Court order updated successfully!");

navigate("/court-orders");


};

if (!selectedOrder) {
return ( <div> <h2>Court Order Not Found</h2>
<button onClick={() => navigate("/court-orders")}>
Back to Court Orders </button> </div>
);
}

return ( <div> <h1>Edit Court Order</h1>


  <form onSubmit={handleSubmit}>
    <div>
      <label>Order ID</label>
      <br />
      <input type="text" value={selectedOrder.id} disabled />
    </div>

    <br />

    <div>
      <label>Case ID</label>
      <br />
      <input
        type="text"
        name="caseId"
        value={formData.caseId}
        onChange={handleChange}
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
        min="1"
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

    <button type="submit">Update Court Order</button>
    {" "}
    <button
      type="button"
      onClick={() => navigate("/court-orders")}
    >
      Cancel
    </button>
  </form>
</div>


);
};

export default EditCourtOrder;
