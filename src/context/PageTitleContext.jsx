import React, { createContext, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types";

const PageTitleContext = createContext();

export const PageTitleProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const contextValue = useMemo(() => ({ pageTitle, setPageTitle }), [pageTitle]);

  return (
    <PageTitleContext.Provider value={contextValue}>
      {children}
    </PageTitleContext.Provider>
  );
};

PageTitleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const usePageTitle = () => useContext(PageTitleContext);
