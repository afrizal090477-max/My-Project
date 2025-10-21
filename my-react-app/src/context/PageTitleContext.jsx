import React, { createContext, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types";

// 1. Buat Context
const PageTitleContext = createContext();

// 2. Buat Provider
export const PageTitleProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("Dashboard");

  // 3. Gunakan useMemo untuk menghindari re-render unnecessary
  const contextValue = useMemo(() => ({ pageTitle, setPageTitle }), [pageTitle]);

  return (
    <PageTitleContext.Provider value={contextValue}>
      {children}
    </PageTitleContext.Provider>
  );
};

// 4. Tambahkan PropTypes agar eslint berhenti complain
PageTitleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 5. Hook agar mudah dipakai
export const usePageTitle = () => useContext(PageTitleContext);
