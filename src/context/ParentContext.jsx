import React, { createContext, useState } from "react";
import parents from "../data/parents";

export const ParentContext = createContext();

const ParentProvider = ({ children }) => {

  const [parentList, setParentList] = useState(() => {

    const savedParents = localStorage.getItem("parents");

    if (savedParents) {
      return JSON.parse(savedParents);
    }

    return parents;
  });


  const saveParents = (updatedParents) => {

    localStorage.setItem(
      "parents",
      JSON.stringify(updatedParents)
    );

    setParentList(updatedParents);
  };


  // ADD PARENT
  const addParent = (newParent) => {

    const updatedParents = [
      ...parentList,
      newParent
    ];

    saveParents(updatedParents);
  };


  // DELETE PARENT
  const deleteParent = (id) => {

    const updatedParents = parentList.filter(
      (item) => item.id !== id
    );

    saveParents(updatedParents);
  };


  // UPDATE PARENT
  const updateParent = (updatedParent) => {

    const updatedParents = parentList.map(
      (item) =>
        item.id === updatedParent.id
          ? updatedParent
          : item
    );

    saveParents(updatedParents);
  };


  return (
    <ParentContext.Provider
      value={{
        parentList,
        addParent,
        updateParent,
        deleteParent
      }}
    >
      {children}
    </ParentContext.Provider>
  );
};

export default ParentProvider;