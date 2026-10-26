import React, { createContext, useState } from "react";
import cases from "../data/cases";

export const CaseContext = createContext();

const CaseProvider = ({ children }) => {

  // Load saved cases from localStorage
  const [caseList, setCaseList] = useState(() => {

    const savedCases = localStorage.getItem("cases");

    if (savedCases) {
      return JSON.parse(savedCases);
    }

    return cases;
  });

  // Save cases to localStorage
  const saveCases = (updatedCases) => {
    localStorage.setItem("cases", JSON.stringify(updatedCases));
    setCaseList(updatedCases);
  };

  // ADD CASE
  const addCase = (newCase) => {

    const updatedCases = [
      ...caseList,
      newCase
    ];

    saveCases(updatedCases);
  };

  // DELETE CASE
  const deleteCase = (id) => {

    const updatedCases = caseList.filter(
      (item) => item.id !== id
    );

    saveCases(updatedCases);
  };

  // UPDATE CASE
  const updateCase = (updatedCase) => {

    const updatedCases = caseList.map(
      (item) =>
        item.id === updatedCase.id
          ? updatedCase
          : item
    );

    saveCases(updatedCases);
  };

  return (
    <CaseContext.Provider
      value={{
        caseList,
        addCase,
        updateCase,
        deleteCase
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export default CaseProvider;