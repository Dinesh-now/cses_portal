import React, { createContext, useState } from "react";
import payments from "../data/payments";

export const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
const [paymentList, setPaymentList] = useState(() => {
const savedPayments = localStorage.getItem("payments");


if (savedPayments) {
  return JSON.parse(savedPayments);
}

return payments;

});

const savePayments = (updatedPayments) => {
localStorage.setItem("payments", JSON.stringify(updatedPayments));
setPaymentList(updatedPayments);
};

const addPayment = (newPayment) => {
savePayments([...paymentList, newPayment]);
};

const deletePayment = (id) => {
savePayments(paymentList.filter((payment) => payment.id !== id));
};

const updatePayment = (updatedPayment) => {
savePayments(
paymentList.map((payment) =>
payment.id === updatedPayment.id ? updatedPayment : payment
)
);
};

return (
<PaymentContext.Provider
value={{
paymentList,
addPayment,
deletePayment,
updatePayment,
}}
>
{children}
</PaymentContext.Provider>
);
};

export default PaymentProvider;
