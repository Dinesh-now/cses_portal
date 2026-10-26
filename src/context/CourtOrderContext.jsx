import React, { createContext, useState } from "react";
import courtOrders from "../data/courtOrders";

export const CourtOrderContext = createContext(null);

const CourtOrderProvider = ({ children }) => {
const [courtOrderList, setCourtOrderList] = useState(() => {
const savedOrders = localStorage.getItem("courtOrders");


if (savedOrders) {
  try {
    return JSON.parse(savedOrders);
  } catch (error) {
    console.error("Error loading court orders:", error);
  }
}

return courtOrders;


});

const saveCourtOrders = (updatedOrders) => {
localStorage.setItem("courtOrders", JSON.stringify(updatedOrders));
setCourtOrderList(updatedOrders);
};

const addCourtOrder = (newOrder) => {
saveCourtOrders([...courtOrderList, newOrder]);
};

const deleteCourtOrder = (id) => {
saveCourtOrders(
courtOrderList.filter((order) => order.id !== id)
);
};

const updateCourtOrder = (updatedOrder) => {
saveCourtOrders(
courtOrderList.map((order) =>
order.id === updatedOrder.id ? updatedOrder : order
)
);
};

return (
<CourtOrderContext.Provider
value={{
courtOrderList,
addCourtOrder,
deleteCourtOrder,
updateCourtOrder,
}}
>
{children}
</CourtOrderContext.Provider>
);
};

export default CourtOrderProvider;
