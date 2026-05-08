// LIBRARY IMPORTS
import React, { createContext, useState, useContext } from "react";

// CREATING REACT CONTEXT PROVIDER WRAPPER
const LoadingContext = createContext();

// CREATING REACT CONTEXT PROVIDER HANDLER
export const LoadingProvider = ({ children }) => {
  // State initialization
  const [activeRequests, setActiveRequests] = useState(0);

  // The handler functions for updating the loading spinner states
  const showLoader = () => setActiveRequests((prev) => prev + 1);
  const hideLoader = () => setActiveRequests((prev) => Math.max(0, prev - 1));

  const isLoading = activeRequests > 0;

  // Returning the wrapper provider
  return (
    <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Exporting the necessary hook for accessing the global states
export const useLoading = () => useContext(LoadingContext);
