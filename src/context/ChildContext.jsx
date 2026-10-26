import React, { createContext, useState } from "react";
import children from "../data/children";

export const ChildContext = createContext();

const ChildProvider = ({ children: providerChildren }) => {

  const [childList, setChildList] = useState(() => {
    const savedChildren = localStorage.getItem("children");

    if (savedChildren) {
      return JSON.parse(savedChildren);
    }

    return children;
  });

  // Save changes to localStorage and React state
  const saveChildren = (updatedChildren) => {
    localStorage.setItem(
      "children",
      JSON.stringify(updatedChildren)
    );

    setChildList(updatedChildren);
  };

  // ADD CHILD
  const addChild = (newChild) => {
    const updatedChildren = [
      ...childList,
      newChild
    ];

    saveChildren(updatedChildren);
  };

  // DELETE CHILD
  const deleteChild = (id) => {
    const updatedChildren = childList.filter(
      (item) => item.id !== id
    );

    saveChildren(updatedChildren);
  };

  // UPDATE CHILD
  const updateChild = (updatedChild) => {
    const updatedChildren = childList.map((item) =>
      item.id === updatedChild.id ? updatedChild : item
    );

    saveChildren(updatedChildren);
  };

  return (
    <ChildContext.Provider
      value={{
        childList,
        addChild,
        updateChild,
        deleteChild
      }}
    >
      {providerChildren}
    </ChildContext.Provider>
  );
};

export default ChildProvider;