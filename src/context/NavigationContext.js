import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [formIsDirty, setFormIsDirty] = useState(false);
  
  const handleNavigation = (to) => {
    // Handle hash navigation
    if (to.startsWith('/#')) {
      if (formIsDirty && window.location.pathname === '/booking') {
        // If in booking page with dirty form, show warning
        setPendingNavigation(to);
        setShowWarning(true);
      } else {
        // Otherwise navigate to home and scroll to section
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(to.replace('/', ''));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
      return;
    }
    
    // Handle regular navigation
    if (formIsDirty && window.location.pathname === '/booking') {
      // If in booking page with dirty form, show warning
      setPendingNavigation(to);
      setShowWarning(true);
    } else {
      // Otherwise navigate directly
      navigate(to);
    }
  };
  
  const confirmNavigation = () => {
    setShowWarning(false);
    if (pendingNavigation) {
      // Handle hash navigation after confirmation
      if (pendingNavigation.startsWith('/#')) {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(pendingNavigation.replace('/', ''));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        navigate(pendingNavigation);
      }
      setPendingNavigation(null);
    }
  };
  
  const cancelNavigation = () => {
    setShowWarning(false);
    setPendingNavigation(null);
  };
  
  return (
    <NavigationContext.Provider 
      value={{ 
        handleNavigation, 
        confirmNavigation, 
        cancelNavigation, 
        showWarning, 
        formIsDirty, 
        setFormIsDirty 
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);