import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext({
    isDirty: false,
    setIsDirty: () => {},
  });

export const FormProvider = ({ children }) => {
  const [isDirty, setIsDirty] = useState(false);
  
  const value = {
    isDirty,
    setIsDirty
  };
  
  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (context === undefined) {
      console.error('useFormContext must be used within a FormProvider');
      // Return default values to prevent crashes
      return { isDirty: false, setIsDirty: () => {} };
    }
    return context;
  };